import { ApolloError, UserInputError } from "apollo-server";
import { dbUtils, context, UUID } from "dsek-shared";
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class Events extends dbUtils.KnexDataSource {
  private convertEvent(event: sql.Event): gql.Event {
    const { author_id, ...rest } = event;
    const convertedEvent = {
      author: {
        id: author_id,
      },
      ...rest,
    };
    return convertedEvent;
  }

  getEvent = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Event>> =>
    this.withAccess('event:read', context, async () => {
      const event = await dbUtils.unique(this.knex<sql.Event>('events').where({ id }));
      if (!event)
        return undefined;
      return this.convertEvent(event);
    });

  getEvents = (context: context.UserContext, page?: number, perPage?: number, filter?: gql.EventFilter): Promise<gql.EventPagination> => this.withAccess('event:read', context, async () => {
    let filtered = this.knex<sql.Event>('events');

    if (filter) {
      if (filter.start_datetime || filter.end_datetime) {
        if (!filter.end_datetime) { filtered = filtered.where('start_datetime', '>=', filter.start_datetime); } else if (!filter.start_datetime) { filtered = filtered.where('start_datetime', '<=', filter.end_datetime); } else { filtered = filtered.whereBetween('start_datetime', [filter.start_datetime, filter.end_datetime]); }
        if (filter.id) { filtered = filtered.where({ id: filter.id }); }
      } else if (filter.id) {
        filtered = filtered.where({ id: filter.id });
      }
    }

    if (page === undefined || perPage === undefined) {
      return {
        events: (await filtered).map(this.convertEvent),
      };
    }
    const res = await filtered
      .clone()
      .offset(page * perPage)
      .limit(perPage);
    const events = res.map((e) => this.convertEvent(e));
    const totalEvents = (await filtered.clone().count({ count: '*' }))[0].count || 0;
    const pageInfo = dbUtils.createPageInfo(<number>totalEvents, page, perPage);

    return {
      events,
      pageInfo,
    };
  });

  createEvent = (context: context.UserContext, input: gql.CreateEvent): Promise<gql.Maybe<gql.Event>> => this.withAccess('event:create', context, async () => {
    const user = await dbUtils.unique(
      this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: context.user?.keycloak_id }),
    );
    if (!user) {
      throw new ApolloError('Could not find member based on keycloak id');
    }
    const newEvent = { ...input, author_id: user.member_id };
    const id = (await this.knex('events').insert(newEvent).returning('id'))[0];
    const event = { id, ...newEvent };
    const convertedEvent = this.convertEvent(event as sql.Event);
    return convertedEvent;
  });

  updateEvent = (context: context.UserContext, id: UUID, input: gql.UpdateEvent): Promise<gql.Maybe<gql.Event>> => this.withAccess('event:update', context, async () => {
    const before = (await this.knex<sql.Event>('events').where({ id }))[0];
    if (!before) throw new UserInputError('id did not exist');

    await this.knex('events').where({ id }).update({ ...input, number_of_updates: before.number_of_updates + 1 });
    const res = (await this.knex<sql.Event>('events').where({ id }))[0];
    if (!res) throw new UserInputError('id did not exist');
    return this.convertEvent(res);
  });

  removeEvent = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Event>> => this.withAccess('event:delete', context, async () => {
    const res = (await this.knex<sql.Event>('events').where({ id }))[0];
    if (!res) throw new UserInputError('id did not exist');
    await this.knex('events').where({ id }).del();
    return this.convertEvent(res);
  });
}
