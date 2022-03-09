import { knex } from 'dsek-shared';

import createApolloServer from '../src/server';

import { ApolloServer } from 'apollo-server';
import { DataSources } from '../src/datasources';
import Song-archiveAPI from '../src/datasources/Song-archives';

export const constructTestServer = (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    song-archiveAPI: new Song-archiveAPI(knex),
  }
  return {
    server: createApolloServer(context, () => dataSources),
    context: context,
    dataSources: dataSources,
  }
}