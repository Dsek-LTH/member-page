import { knex } from 'dsek-shared';

import SongsAPI from './datasources/Songs';

export interface DataSources {
  songsAPI: SongsAPI,
}

export default () => ({
  songsAPI: new SongsAPI(knex),
});
