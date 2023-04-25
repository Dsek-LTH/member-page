import { ApolloServer } from 'apollo-server';

import createApolloServer from '~/src/server';

import datasources, { DataSources } from '~/src/datasources';
import { context } from '~/src/shared';

type TestServerReturn = { server: ApolloServer, context: any, dataSources: DataSources };

export default (ctx?: context.UserContext): TestServerReturn => {
  const dataSources = datasources();
  return ({
    server: createApolloServer(ctx, () => dataSources),
    context,
    dataSources,
  });
};
