import { readFileSync } from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import { context } from 'dsek-shared';

import dataSources from './datasources';

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
  context: context.deserializeContext,
  dataSources: dataSources,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});