import { knex } from 'dsek-shared';

import { ApolloServer } from 'apollo-server';
import createApolloServer from '../src/server';

import { DataSources } from '../src/datasources';
import NewsAPI from '../src/datasources/News';

export default (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    newsAPI: new NewsAPI(knex),
  };
  return {
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  };
};
