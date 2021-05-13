import { UserInputError } from "apollo-server";
import { dbUtils } from "dsek-shared";
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class Events extends dbUtils.KnexDataSource {

    async getEvent(id: number): Promise<gql.Maybe<gql.Event>> {
        const event = await dbUtils.unique(this.knex<sql.DbEvent>('events').where({id}));
        if (!event) throw new UserInputError('id did not exist');
        return event;
    }

    async getEvents(filter?: gql.EventFilter): Promise<gql.Event[]> {
        let events = this.knex<sql.DbEvent>('events').select('*')

        if(filter){
            if(filter.start_datetime || filter.end_datetime) {
                if(!filter.end_datetime)
                    events = events.where('start_datetime', '>=', filter.start_datetime)
                else if(!filter.start_datetime)
                    events = events.where('start_datetime', '<=', filter.end_datetime)
                else
                    events = events.whereBetween('start_datetime', [filter.start_datetime, filter.end_datetime])

                if(filter.id)
                    events = events.where({id: filter.id})
            } else if(filter.id) {
                events = events.where({id: filter.id})
            }
        }

        return events;
    }

    async createEvent(input: gql.CreateEvent): Promise<gql.Maybe<gql.Event>> {
        const id = (await this.knex('events').insert(input))[0]
        const res = (await this.knex<sql.DbEvent>('events').where({id}))[0];
        return res;
    }

    async updateEvent(id: number, input: gql.UpdateEvent): Promise<gql.Maybe<gql.Event>> {
        await this.knex('events').where({id}).update(input);
        const res = (await this.knex<sql.DbEvent>('events').where({id}))[0];
        if (!res) throw new UserInputError('id did not exist');
        return res;
    }

    async removeEvent(id: number): Promise<gql.Maybe<gql.Event>> {
        const res = (await this.knex<sql.DbEvent>('events').where({id}))[0];
        if(!res) throw new UserInputError('id did not exist');
        await this.knex('events').where({id}).del();
        return res;
    }

}
