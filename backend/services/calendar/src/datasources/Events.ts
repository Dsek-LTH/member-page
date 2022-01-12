import { ApolloError, UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from 'dsek-shared';
import { chooseTranslation, Language } from 'dsek-shared/dist/language';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export function convertEvent(
  event: sql.Event,
  lang: Language,
  force: boolean = false,
): gql.Event {
  const {
    author_id,
    title, title_en,
    description, description_en,
    short_description, short_description_en,
    ...rest
  } = event;

  const convertedEvent = {
    author: {
      id: author_id,
    },
    title: chooseTranslation({ sv: title, en: title_en }, lang, force),
    description: chooseTranslation({ sv: description, en: description_en }, lang, force),
    short_description: chooseTranslation(
      { sv: short_description, en: short_description_en },
      lang,
      force,
    ),
    ...rest,
  };
  return convertedEvent;
}

export default class Events extends dbUtils.KnexDataSource {
  getEvent(ctx: context.UserContext, id: UUID, lang?: gql.Language): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:read', ctx, async () => {
      const event = await dbUtils.unique(this.knex<sql.Event>('events').where({ id }));
      if (!event) {
        return undefined;
      }
      return convertEvent(event, lang ?? ctx.language, !!lang);
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
          if (!filter.end_datetime) { filtered = filtered.where('start_datetime', '>=', filter.start_datetime); } else if (!filter.start_datetime) { filtered = filtered.where('start_datetime', '<=', filter.end_datetime); } else { filtered = filtered.whereBetween('start_datetime', [filter.start_datetime, filter.end_datetime]); }
          if (filter.id) { filtered = filtered.where({ id: filter.id }); }
        } else if (filter.id) {
          filtered = filtered.where({ id: filter.id });
        }
      }

      if (page === undefined || perPage === undefined) {
        return {
          events: (await filtered).map((e) => convertEvent(e, ctx.language)),
        };
      }
      const res = await filtered
        .clone()
        .offset(page * perPage)
        .limit(perPage);
      const events = res.map((e) => convertEvent(e, ctx.language));
      const totalEvents = (await filtered.clone().count({ count: '*' }))[0].count || 0;
      const pageInfo = dbUtils.createPageInfo(<number>totalEvents, page, perPage);

      return {
        events,
        pageInfo,
      };
    });
  }

  createEvent(ctx: context.UserContext, input: gql.CreateEvent): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:create', ctx, async () => {
      const user = await dbUtils.unique(
        this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }),
      );
      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }
      const newEvent = { ...input, author_id: user.member_id };
      const id = (await this.knex('events').insert(newEvent).returning('id'))[0];
      const event = { id, ...newEvent };
      const convertedEvent = convertEvent(event as sql.Event, ctx.language);
      return convertedEvent;
    });
  }

  updateEvent(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateEvent,
  ): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:update', ctx, async () => {
      const before = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!before) throw new UserInputError('id did not exist');

      await this.knex('events').where({ id }).update({ ...input, number_of_updates: before.number_of_updates + 1 });
      const res = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!res) throw new UserInputError('id did not exist');
      return convertEvent(res, ctx.language);
    });
  }

  removeEvent(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Event>> {
    return this.withAccess('event:delete', ctx, async () => {
      const res = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!res) throw new UserInputError('id did not exist');
      await this.knex('events').where({ id }).del();
      return convertEvent(res, ctx.language);
    });
  }
}
