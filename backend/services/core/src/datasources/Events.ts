import { ApolloError, UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/events';
import { Member } from '../types/database';
import { convertEvent } from '../shared/converters';

const convertComment = (comment: sql.Comment, members: Member[]): gql.Comment => ({
  id: comment.id,
  content: comment.content,
  member: members.find((m) => m.id === comment.member_id)!,
  published: comment.published,
});

export default class EventAPI extends dbUtils.KnexDataSource {
  getEvent(ctx: context.UserContext, id?: UUID, slug?: string): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:read', ctx, async () => {
      if (!id && !slug) return undefined;
      const query = this.knex<sql.Event>('events');
      if (id) query.where({ id });
      else if (slug) query.where({ slug });
      const event = await query.first();
      if (!event) {
        return undefined;
      }
      return convertEvent({ event });
    });
  }

  getEvents(
    ctx: context.UserContext,
    page?: number,
    perPage?: number,
    filter?: gql.EventFilter,
  ): Promise<gql.EventPagination> {
    return this.withAccess('event:read', ctx, async () => {
      let filtered = this.knex<sql.Event>('events');

      if (filter) {
        if (filter.start_datetime || filter.end_datetime) {
          if (!filter.end_datetime) {
            filtered = filtered.where(
              'start_datetime',
              '>=',
              filter.start_datetime,
            );
          } else if (!filter.start_datetime) {
            filtered = filtered.where(
              'start_datetime',
              '<=',
              filter.end_datetime,
            );
          } else {
            filtered = filtered.whereBetween('start_datetime', [
              filter.start_datetime,
              filter.end_datetime,
            ]);
          }
          if (filter.id) {
            filtered = filtered.where({ id: filter.id });
          }
        } else if (filter.id) {
          filtered = filtered.where({ id: filter.id });
        }
      }

      if (page === undefined || perPage === undefined) {
        return {
          events: await Promise.all(
            (
              await filtered
            ).map((event) => convertEvent({ event })),
          ),
        };
      }
      const res = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy('start_datetime', 'asc')
        .limit(perPage);
      const events = await Promise.all(
        res.map((e) => convertEvent({ event: e })),
      );
      const totalEvents = (await filtered.clone().count({ count: '*' }))[0].count || 0;
      const pageInfo = dbUtils.createPageInfo(
        <number>totalEvents,
        page,
        perPage,
      );

      return {
        events,
        pageInfo,
      };
    });
  }

  async getGoingCount(event_id: UUID): Promise<number> {
    return this.getSocialCount('event_going', event_id);
  }

  async getInterestedCount(event_id: UUID): Promise<number> {
    return this.getSocialCount('event_interested', event_id);
  }

  async getSocialCount(table: sql.SocialTable, event_id: UUID): Promise<number> {
    return (
      Object.fromEntries(
        (
          await this.knex<sql.MemberEventLink>(table)
            .select('event_id')
            .count({ count: '*' })
            .where({ event_id })
            .groupBy('event_id')
        ).map((r) => [r.event_id, Number(r.count)]),
      )[event_id] ?? 0
    );
  }

  async userIsInterested(event_id: UUID, keycloak_id?: string): Promise<boolean> {
    return this.getSocialFromKeycloakId('event_interested', event_id, keycloak_id);
  }

  async userIsGoing(event_id: UUID, keycloak_id?: string): Promise<boolean> {
    return this.getSocialFromKeycloakId('event_going', event_id, keycloak_id);
  }

  async getSocialFromKeycloakId(
    table: sql.SocialTable,
    event_id: UUID,
    keycloak_id?: string,
  ): Promise<boolean> {
    if (!keycloak_id) return false;
    return (
      Object.fromEntries(
        (
          await this.knex<sql.MemberEventLink>(table)
            .select('event_id')
            .join(
              'keycloak',
              'keycloak.member_id',
              '=',
              `${table}.member_id`,
            )
            .where({ keycloak_id })
            .where({ event_id })
        ).map((r) => [r.event_id, true]),
      )[event_id] ?? false
    );
  }

  createEvent(
    ctx: context.UserContext,
    input: gql.CreateEvent,
  ): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:create', ctx, async () => {
      const user = await dbUtils.unique(
        this.knex<sql.Keycloak>('keycloak').where({
          keycloak_id: ctx.user?.keycloak_id,
        }),
      );
      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const newEvent = {
        ...input,
        author_id: user.member_id,
        slug: await this.slugify('events', input.title),
      };

      const id = (
        await this.knex('events').insert(newEvent).returning('id')
      )[0];
      const event: sql.Event = {
        id, ...newEvent, number_of_updates: 0, link: newEvent.link ?? '',
      };
      const convertedEvent = convertEvent({ event });
      return convertedEvent;
    });
  }

  async updateEvent(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateEvent,
  ): Promise<gql.Maybe<gql.Event>> {
    const before = await this.knex<sql.Event>('events').where({ id }).first();
    return this.withAccess('event:update', ctx, async () => {
      if (!before) throw new UserInputError('id did not exist');

      await this.knex('events')
        .where({ id })
        .update({ ...input, number_of_updates: before.number_of_updates + 1 });
      const event = await this.knex<sql.Event>('events').where({ id }).first();
      if (!event) throw new UserInputError('id did not exist');
      return convertEvent({ event });
    }, before?.author_id);
  }

  async removeEvent(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.Event>> {
    const before = await this.knex<sql.Event>('events').where({ id }).first();
    return this.withAccess('event:delete', ctx, async () => {
      const event = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!event) throw new UserInputError('id did not exist');
      await this.knex('events').where({ id }).del();
      return convertEvent({ event });
    }, before?.author_id);
  }

  setGoing(ctx: context.UserContext, id: UUID) {
    return this.createSocialRelation('event_going', ctx, id);
  }

  unsetGoing(ctx: context.UserContext, id: UUID) {
    return this.deleteSocialRelation('event_going', ctx, id);
  }

  setInterested(ctx: context.UserContext, id: UUID) {
    return this.createSocialRelation('event_interested', ctx, id);
  }

  unsetInterested(ctx: context.UserContext, id: UUID) {
    return this.deleteSocialRelation('event_interested', ctx, id);
  }

  private createSocialRelation(
    table: sql.SocialTable,
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:social', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError(`Could not find member based on keycloak id. Id: ${ctx.user?.keycloak_id}`);
      }

      const event = await dbUtils.unique(this.knex<sql.Event>('events').where({ id }));
      if (!event) throw new UserInputError(`Event with id did not exist. Id: ${id}`);

      try {
        await this.knex<sql.MemberEventLink>(table).insert({
          event_id: id,
          member_id: user.member_id,
        });
      } catch {
        throw new ApolloError('User is already going to/interested in this event');
      }

      return convertEvent({
        event,
        peopleGoing: await this.getPeopleGoing(id),
        peopleInterested: await this.getPeopleInterested(id),
        iAmGoing: table === 'event_going',
        iAmInterested: table === 'event_interested',
      });
    });
  }

  private deleteSocialRelation(
    table: sql.SocialTable,
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:social', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError(`Could not find member based on keycloak id. Id: ${ctx.user?.keycloak_id}`);
      }

      const event = await dbUtils.unique(this.knex<sql.Event>('events').where({ id }));
      if (!event) throw new UserInputError(`Event with id did not exist. Id: ${id}`);

      const currentLike = await this.knex<sql.MemberEventLink>(table).where({
        event_id: id,
        member_id: user.member_id,
      }).del();

      if (!currentLike) throw new ApolloError('User is not going to / interested in this event');
      return convertEvent({
        event,
        peopleGoing: await this.getPeopleGoing(id),
        peopleInterested: await this.getPeopleInterested(id),
      });
    });
  }

  private async getPeople(table: sql.SocialTable, event_id: UUID): Promise<gql.Member[]> {
    const likes = await this.knex<sql.MemberEventLink>(table).where({ event_id });
    const memberIds: string[] = [...new Set(likes.map((l) => l.member_id))];
    const members = await this.knex<Member>('members').whereIn('id', memberIds);
    return members;
  }

  async getPeopleGoing(event_id: UUID): Promise<gql.Member[]> {
    return this.getPeople('event_going', event_id);
  }

  async getPeopleInterested(event_id: UUID): Promise<gql.Member[]> {
    return this.getPeople('event_interested', event_id);
  }

  async getComments(event_id: UUID): Promise<gql.Comment[]> {
    const sqlComments = await this.knex<sql.Comment>('event_comments').where({ event_id }).orderBy('published', 'asc');
    const memberIds: string[] = [...new Set(sqlComments.map((c) => c.member_id))];
    const members = await this.knex<Member>('members').whereIn('id', memberIds);
    const comments: gql.Comment[] = sqlComments.map((c) => convertComment(c, members));
    return comments;
  }

  async getComment(id: UUID): Promise<gql.Maybe<gql.Comment>> {
    const sqlComment = await this.knex<sql.Comment>('event_comments').where({ id }).first();
    if (!sqlComment) throw new UserInputError(`Comment with id ${id} does not exist`);
    const members = await this.knex<Member>('members').where({ id: sqlComment?.member_id });
    return convertComment(sqlComment, members);
  }

  commentEvent(
    ctx: context.UserContext,
    event_id: UUID,
    content: string,
  ): Promise<gql.Event> {
    return this.withAccess('event:comment', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError(`Could not find member based on keycloak id. Id: ${ctx.user?.keycloak_id}`);
      }

      const event = await this.getEvent(ctx, event_id);
      if (!event) throw new UserInputError(`Event with id did not exist. Id: ${event_id}`);

      await this.knex<sql.Comment>('event_comments').insert({
        event_id,
        member_id: user.member_id,
        content,
        published: new Date(),
      });

      return event;
    });
  }

  async removeComment(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Event> {
    const comment = await this.knex<sql.Comment>('event_comments').where({ id }).first();
    return this.withAccess('event:comment:delete', ctx, async () => {
      if (!comment) throw new UserInputError('comment id did not exist');
      const event = await this.getEvent(ctx, comment?.event_id);
      if (!event) throw new UserInputError('Event does not exist?');
      await this.knex<sql.Event>('event_comments').where({ id }).del();
      return event;
    }, comment?.member_id);
  }
}
