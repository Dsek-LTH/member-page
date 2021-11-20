import { knex } from 'dsek-shared';

import createApolloServer from '../src/server';

import { ApolloServer } from 'apollo-server';
import { DataSources } from '../src/datasources';
import FilesAPI from '../src/datasources/Files';

export const constructTestServer = (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    filesAPI: new FilesAPI(knex),
  }
  return {
    server: createApolloServer(context, () => dataSources),
    context: context,
    dataSources: dataSources,
  }
}