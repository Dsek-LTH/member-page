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
import { context } from './shared';
import { getRoleNames, verifyAndDecodeToken } from './gateway';
import dataSources from './datasources';

const coreSrc = readFileSync(resolve(__dirname, 'schemas/core.graphql'));
const bookingSrc = readFileSync(resolve(__dirname, 'schemas/booking.graphql'));
const eventsSrc = readFileSync(resolve(__dirname, 'schemas/events.graphql'));
const fileSrc = readFileSync(resolve(__dirname, 'schemas/file.graphql'));
const newsSrc = readFileSync(resolve(__dirname, 'schemas/news.graphql'));

const typeDefs = gql`${Buffer.concat([coreSrc, bookingSrc, eventsSrc, fileSrc, newsSrc])}`;

const createApolloServer = () => new ApolloServer({
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
  context: async ({ req }) => {
    const { authorization } = req.headers;
    if (!authorization) return undefined;

    const token = authorization.split(' ')[1]; // Remove "Bearer" from token
    const decodedToken = await verifyAndDecodeToken(token);

    if (!decodedToken) return undefined;

    const c: context.UserContext = {
      user: {
        keycloak_id: decodedToken.sub,
        student_id: decodedToken.preferred_username,
        name: decodedToken.name,
      },
      roles: Array.from(new Set(decodedToken.group.map((group) => getRoleNames(group)).join().split(','))),
    };
    return c;
  },
  dataSources,
});

export default createApolloServer;
