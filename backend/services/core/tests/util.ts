import { ApolloServer } from 'apollo-server';

import createApolloServer from '../src/server';

import dataSources, { DataSources } from '../src/datasources';

type TestServerReturn = {server: ApolloServer, context: any, dataSources: DataSources}

export default (context?: any): TestServerReturn => ({
  server: createApolloServer(),
  context,
  dataSources: dataSources(),
});
