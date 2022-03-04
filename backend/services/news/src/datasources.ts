import { knex } from 'dsek-shared';
import MarkdownsAPI from './datasources/Markdowns';

import NewsAPI from './datasources/News';

export interface DataSources {
  newsAPI: NewsAPI,
  markdownsAPI: MarkdownsAPI,
}

export default () => ({
  newsAPI: new NewsAPI(knex),
  markdownsAPI: new MarkdownsAPI(knex),
});
