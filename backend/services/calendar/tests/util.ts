import { knex } from 'dsek-shared';

import { ApolloServer } from 'apollo-server';
import createApolloServer from '../src/server';

import { DataSources } from '../src/datasources';
import EventAPI from '../src/datasources/Events';

type TestServerReturn = {server: ApolloServer, context: any, dataSources: DataSources}

export default (context?: any): TestServerReturn => {
  const dataSources: DataSources = {
    eventAPI: new EventAPI(knex),
  };
  return {
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  };
};
