import { ApolloServer } from 'apollo-server';

import createApolloServer from '~/src/server';

import datasources, { DataSources } from '~/src/datasources';

type TestServerReturn = { server: ApolloServer, context: any, dataSources: DataSources };

export default (context?: any): TestServerReturn => {
  const dataSources = datasources();
  return ({
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  });
};
