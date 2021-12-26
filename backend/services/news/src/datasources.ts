import { knex } from 'dsek-shared';

import NewsAPI from './datasources/News';

export interface DataSources {
  newsAPI: NewsAPI,
}

export default () => ({
  newsAPI: new NewsAPI(knex),
});
