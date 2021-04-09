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
        const events = await this.knex<sql.DbEvent>('events')
                        .select('*')
                        .where(filter || {});
        return events;
    }
    
    async createEvent(title: string, description: string, start_datetime: string, end_datetime?: string, link?: string): Promise<gql.Maybe<gql.Event>> {
        const newEvent = {
            title: title,
            description: description,
            link: link,
            start_datetime: start_datetime,
            end_datetime: end_datetime,
        }
        const id = (await this.knex('events').insert(newEvent))[0];
        const res = (await this.knex<sql.DbEvent>('events').where({id}))[0];
        return res;
    }
    
    async updateEvent(id: number, title?: string, description?: string, link?: string, start_datetime?: string, end_datetime?: string): Promise<gql.Maybe<gql.Event>> {
        const updatedEvent = {
            title: title,
            description: description,
            link: link,
            start_datetime: start_datetime,
            end_datetime: end_datetime,
        };
        await this.knex('events').where({id}).update(updatedEvent);
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
