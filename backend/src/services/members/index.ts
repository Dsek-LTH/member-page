import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { deserializeContext } from '../../context';
import { defMembers } from '../services';

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: deserializeContext
});

server.listen({ port: defMembers.port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});