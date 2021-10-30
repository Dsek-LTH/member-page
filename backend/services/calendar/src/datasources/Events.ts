import { UserInputError } from "apollo-server";
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
            return event;
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

            return events;
        });

    createEvent = (context: context.UserContext, input: gql.CreateEvent): Promise<gql.Maybe<gql.Event>> =>
        this.withAccess('event:create', context, async () => {
            const id = (await this.knex('events').insert(input).returning('id'))[0]
            const res = (await this.knex<sql.Event>('events').where({ id }))[0];
            return res;
        });

    updateEvent = (context: context.UserContext, id: number, input: gql.UpdateEvent): Promise<gql.Maybe<gql.Event>> =>
        this.withAccess('event:update', context, async () => {
            await this.knex('events').where({ id }).update(input);
            const res = (await this.knex<sql.Event>('events').where({ id }))[0];
            if (!res) throw new UserInputError('id did not exist');
            return res;
        });

    removeEvent = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Event>> =>
        this.withAccess('event:delete', context, async () => {
            const res = (await this.knex<sql.Event>('events').where({ id }))[0];
            if (!res) throw new UserInputError('id did not exist');
            await this.knex('events').where({ id }).del();
            return res;
        });
}
