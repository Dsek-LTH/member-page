import { ApolloError, UserInputError } from "apollo-server";
import { dbUtils, context } from "dsek-shared";
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

  getEvent = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Event>> =>
    this.withAccess('event:read', context, async () => {
      const event = await dbUtils.unique(this.knex<sql.Event>('events').where({ id }));
      if (!event) throw new UserInputError('id did not exist');
      return this.convertEvent(event);
    });

  getEvents = (context: context.UserContext, filter?: gql.EventFilter): Promise<gql.Event[]> =>
    this.withAccess('event:read', context, async () => {
      let events = this.knex<sql.Event>('events').select('*')

      if (filter) {
        if (filter.start_datetime || filter.end_datetime) {
          if (!filter.end_datetime)
            events = events.where('start_datetime', '>=', filter.start_datetime)
          else if (!filter.start_datetime)
            events = events.where('start_datetime', '<=', filter.end_datetime)
          else
            events = events.whereBetween('start_datetime', [filter.start_datetime, filter.end_datetime])

          if (filter.id)
            events = events.where({ id: filter.id })
        } else if (filter.id) {
          events = events.where({ id: filter.id })
        }
      }

      return (await events).map((event) => this.convertEvent(event));
    });

  createEvent = (context: context.UserContext, input: gql.CreateEvent): Promise<gql.Maybe<gql.Event>> =>
    this.withAccess('event:create', context, async () => {
      const user = await dbUtils.unique(
        this.knex<sql.Keycloak>("keycloak").where({ keycloak_id: context.user?.keycloak_id })
      );
      if (!user) {
        throw new ApolloError("Could not find member based on keycloak id");
      }
      const newEvent = { ...input, author_id: user.member_id };
      const id = (await this.knex("events").insert(newEvent).returning("id"))[0];
      const event = { id, ...newEvent };
      const convertedEvent = this.convertEvent(event as sql.Event);
      return convertedEvent;
    });

  updateEvent = (context: context.UserContext, id: number, input: gql.UpdateEvent): Promise<gql.Maybe<gql.Event>> =>
    this.withAccess('event:update', context, async () => {
      await this.knex('events').where({ id }).update(input);
      const res = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!res) throw new UserInputError('id did not exist');
      return this.convertEvent(res);
    });

  removeEvent = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Event>> =>
    this.withAccess('event:delete', context, async () => {
      const res = (await this.knex<sql.Event>('events').where({ id }))[0];
      if (!res) throw new UserInputError('id did not exist');
      await this.knex('events').where({ id }).del();
      return this.convertEvent(res);
    });
}
