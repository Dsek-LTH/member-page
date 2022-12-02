/* eslint-disable class-methods-use-this */
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { merge } from 'lodash';
import coreResolvers from './resolvers/coreResolvers';
import fileResolvers from './resolvers/fileResolvers';
import newsResolvers from './resolvers/newsResolvers';
import eventResolvers from './resolvers/eventResolvers';
import bookingResolvers from './resolvers/bookingResolvers';
import dataSources from './datasources';
import notificationResolvers from './resolvers/notificationResolvers';
import webshopResolvers from './resolvers/webshopResolvers';
import middleware from './middleware';

/**
 * Combines all .graphl files in /schemas
 */
function getTypeDefs() {
  const files = readdirSync(resolve(__dirname, 'schemas')).filter((file) => file.endsWith('.graphql'));
  const buffers: Buffer[] = files.map((file) => readFileSync(resolve(__dirname, `schemas/${file}`)));
  return Buffer.concat(buffers);
}

const typeDefs = gql`${getTypeDefs()}`;

/**
 *
 * @param importedContext used for testing
 * @param importedDataSources used for testing
 * @returns
 */
const createApolloServer = (importedContext?: any, importedDataSources?: any) => new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers: merge(
        coreResolvers,
        fileResolvers,
        newsResolvers,
        eventResolvers,
        bookingResolvers,
        notificationResolvers,
        webshopResolvers,
      ),
    },
  ]),
  context: importedContext || middleware.createContext,
  dataSources: importedDataSources || dataSources,
  introspection: process.env.SANDBOX === 'true' || process.env.NODE_ENV !== 'production',
  playground: process.env.SANDBOX === 'true' || process.env.NODE_ENV !== 'production',
});

export default createApolloServer;
