import { knex } from 'dsek-shared';

import EventsAPI from './datasources/Events';

export interface DataSources {
  eventsAPI: EventsAPI,
}

export default () => {
  return {
    eventsAPI: new EventsAPI(knex),
  }
}