import { knex } from 'dsek-shared';

import { ApolloServer } from 'apollo-server';
import createApolloServer from '../src/server';

import { DataSources } from '../src/datasources';
import NewsAPI from '../src/datasources/News';
import MarkdownsAPI from '../src/datasources/Markdowns';
import NotificationsAPI from '../src/datasources/Notifications';
import TagsAPI from '../src/datasources/Tags';

export default (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    newsAPI: new NewsAPI(knex),
    markdownsAPI: new MarkdownsAPI(knex),
    notificationsAPI: new NotificationsAPI(knex),
    tagsAPI: new TagsAPI(knex),
  };
  return {
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  };
};
