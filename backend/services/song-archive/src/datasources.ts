import { knex } from 'dsek-shared';

import Song-archiveAPI from './datasources/Song-archives';

export interface DataSources {
  song-archiveAPI: Song-archiveAPI,
}

export default () => {
  return {
    song-archiveAPI: new Song-archiveAPI(knex),
  }
}