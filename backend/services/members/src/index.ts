import { readFileSync } from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import { context } from 'dsek-shared';

const typesSrc = readFileSync('schema.graphql');
const typeDefs = gql`${typesSrc}`
import resolvers from './resolvers';

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