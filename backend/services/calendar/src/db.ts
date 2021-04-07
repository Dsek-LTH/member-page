import { knex, dbUtils } from 'dsek-shared';
import { UserInputError } from 'apollo-server';

interface DbEvent {
  id: number,
  title: string,
  description: string,
  link?: string,
  start_datetime: string,
  end_datetime: string,
}

const getEvent = async (id: number) => {
  const event = await dbUtils.unique(knex<DbEvent>('events').where({id}));
  if (!event) throw new UserInputError('id did not exist');
  return event;
}

const getEvents = async () => {
  const events = await knex<DbEvent>('events')
                  .select('*');
  return events;
}

export {
  getEvent,
  getEvents
}