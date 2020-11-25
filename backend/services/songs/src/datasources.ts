import { knex } from 'dsek-shared';

import SongAPI from './datasources/Song';

export interface DataSources {
  songAPI: SongAPI,
}

export default () => {
  return {
    songAPI: new SongAPI(knex),
  }
}