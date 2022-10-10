import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { merge } from 'lodash';
import coreResolvers from './resolvers/coreResolvers';
import fileResolvers from './resolvers/fileResolvers';
import newsResolvers from './resolvers/newsResolvers';
import eventResolvers from './resolvers/eventResolvers';
import bookingResolvers from './resolvers/bookingResolvers';

const coreSrc = readFileSync(resolve(__dirname, 'schemas/core.graphql'));
const bookingSrc = readFileSync(resolve(__dirname, 'schemas/booking.graphql'));
const eventsSrc = readFileSync(resolve(__dirname, 'schemas/events.graphql'));
const fileSrc = readFileSync(resolve(__dirname, 'schemas/file.graphql'));
const newsSrc = readFileSync(resolve(__dirname, 'schemas/news.graphql'));

const typeDefs = gql`${Buffer.concat([coreSrc, bookingSrc, eventsSrc, fileSrc, newsSrc])}`;

const createApolloServer = (context: any, dataSources?: any) => new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers: merge(
        coreResolvers,
        fileResolvers,
        newsResolvers,
        eventResolvers,
        bookingResolvers,
      ),
    },
  ]),
  context,
  dataSources,
});

export default createApolloServer;
