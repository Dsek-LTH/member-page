import { knex } from 'dsek-shared';

import { createApolloServer } from '../src/index'

import { ApolloServer } from 'apollo-server';
import { DataSources } from '../src/datasources';
import SongAPI from '../src/datasources/Song';

export const constructTestServer = (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    songAPI: new SongAPI(knex),
  }
  return {
    server: createApolloServer(context, () => dataSources),
    context: context,
    dataSources: dataSources,
  }
}
