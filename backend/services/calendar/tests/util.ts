import { knex } from 'dsek-shared';

import createApolloServer from '../src/server';

import { ApolloServer } from 'apollo-server';
import { DataSources } from '../src/datasources';
import EventAPI from '../src/datasources/Events';

export const constructTestServer = (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    eventAPI: new EventAPI(knex),
  }
  return {
    server: createApolloServer(context, () => dataSources),
    context: context,
    dataSources: dataSources,
  }
}