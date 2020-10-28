import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { context } from 'dsek-shared';

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: context.deserializeContext
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
