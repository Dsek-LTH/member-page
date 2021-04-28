import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

const typesSrc = readFileSync(resolve(__dirname, 'schema.graphql'));
const typeDefs = gql`${typesSrc}`;
import resolvers from './resolvers';

const createApolloServer = (context: any, dataSources?: any) => {
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
};

export default createApolloServer;