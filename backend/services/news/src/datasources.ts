import { knex } from 'dsek-shared';
import MarkdownsAPI from './datasources/Markdowns';
import TagsAPI from './datasources/Tags';
import NewsAPI from './datasources/News';
import NotificationsAPI from './datasources/Notifications';

export interface DataSources {
  newsAPI: NewsAPI,
  markdownsAPI: MarkdownsAPI,
  notifications: NotificationsAPI,
  tagsAPI: TagsAPI,
}

export default () => ({
  newsAPI: new NewsAPI(knex),
  markdownsAPI: new MarkdownsAPI(knex),
  notifications: new NotificationsAPI(knex),
  tagsAPI: new TagsAPI(knex),
});
