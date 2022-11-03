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
import { context } from './shared';
import verifyAndDecodeToken from './verifyAndDecodeToken';
import dataSources from './datasources';
import { getRoleNames } from './keycloak';

/**
 * Combines all .graphl files in /schemas
 */
function getTypeDefs() {
  const files = readdirSync(resolve(__dirname, 'schemas')).filter((file) => file.endsWith('.graphql'));
  const buffers: Buffer[] = files.map((file) => readFileSync(resolve(__dirname, `schemas/${file}`)));
  return Buffer.concat(buffers);
}

const typeDefs = gql`${getTypeDefs()}`;

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
      ),
    },
  ]),
  context: importedContext || (async ({ req }) => {
    if (process.env.NODE_ENV !== 'test') {
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
    }
    return undefined;
  }),
  dataSources: importedDataSources || dataSources,
});

export default createApolloServer;
