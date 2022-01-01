import { knex } from 'dsek-shared';

import EventAPI from './datasources/Events';

export interface DataSources {
  eventAPI: EventAPI,
}

export default () => ({
  eventAPI: new EventAPI(knex),
});
