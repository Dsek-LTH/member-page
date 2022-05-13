import { knex } from 'dsek-shared';
import MarkdownsAPI from './datasources/Markdowns';
import NewsAPI from './datasources/News';
import NotificationsAPI from './datasources/Notifications';

export interface DataSources {
  newsAPI: NewsAPI,
  markdownsAPI: MarkdownsAPI,
  notifications: NotificationsAPI,
}

export default () => ({
  newsAPI: new NewsAPI(knex),
  markdownsAPI: new MarkdownsAPI(knex),
  notifications: new NotificationsAPI(knex),
});
