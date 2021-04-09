import { knex, dbUtils } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import * as gql from './typeDefs';

interface DbEvent {
  id: number,
  title: string,
  description: string,
  link: string,
  start_datetime: string,
  end_datetime: string,
}

const getEvent = async (id: number) => {
  const event = await dbUtils.unique(knex<DbEvent>('events').where({id}));
  if (!event) throw new UserInputError('id did not exist');
  return event;
}

const getEvents = async (filter: EventFilter) => {
  const events = await knex<DbEvent>('events')
                  .select('*')
                  .where(filter);
  return events;
}

const createEvent = async (title: string, description: string, link: string, start_datetime: string, end_datetime: string) => {
  const newEvent = {
    title: title,
    description: description,
    link: link,
    start_datetime: start_datetime,
    end_datetime: end_datetime,
  }
  const id = (await knex('events').insert(newEvent))[0];
  const res = (await knex<DbEvent>('events').where({id}))[0];
  return res;
}

const updateEvent = async (id: number, title: string, description: string, link: string, start_datetime: string, end_datetime: string) => {
  const updatedEvent = {
    title: title,
    description: description,
    link: link,
    start_datetime: start_datetime,
    end_datetime: end_datetime,
  };
  await knex('events').where({id}).update(updatedEvent);
  const res = (await knex<DbEvent>('events').where({id}))[0];
  if (!res) throw new UserInputError('id did not exist');
  return res;
}

const removeEvent = async (id: number) => {
  const res = (await knex<DbEvent>('events').where({id}))[0];
  if(!res) throw new UserInputError('id did not exist');
  await knex('events').where({id}).del();
  return res;
}

export {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  removeEvent,
  DbEvent
}
