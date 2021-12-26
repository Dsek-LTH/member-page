import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import resolvers from './resolvers';

const typesSrc = readFileSync(resolve(__dirname, 'schema.graphql'));
const typeDefs = gql`${typesSrc}`;

const createApolloServer = (context: any, dataSources?: any) => new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  context,
  dataSources,
});

export default createApolloServer;
