import { knex } from 'dsek-shared';
import MarkdownsAPI from './datasources/Markdowns';
import NewsAPI from './datasources/News';
import Notifications from './datasources/Notifications';

export interface DataSources {
  newsAPI: NewsAPI,
  markdownsAPI: MarkdownsAPI,
  notifications: Notifications,
}

export default () => ({
  newsAPI: new NewsAPI(knex),
  markdownsAPI: new MarkdownsAPI(knex),
  notifications: new Notifications(knex),
});
