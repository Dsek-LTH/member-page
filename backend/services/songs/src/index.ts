import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import { context } from 'dsek-shared';

import dataSources from './datasources';

const typesSrc = readFileSync(resolve(__dirname, 'schema.graphql'));
const typeDefs = gql`${typesSrc}`
import resolvers from './resolvers';

export const createApolloServer = (context: any, dataSources?: any) => {
  return new ApolloServer({
    schema: buildFederatedSchema([
      {
        typeDefs,
        resolvers
      }
    ]),
    context: context,
    dataSources: dataSources,
  });
}

const server = createApolloServer(context.deserializeContext, dataSources);

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});