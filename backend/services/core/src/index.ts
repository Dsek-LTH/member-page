import { schedule } from 'node-cron';
import {
  knex, createLogger,
} from './shared';
import createApolloServer from './server';
import { indexMeilisearch, updateKeycloakMandates } from './shared/adminUtils';

const logger = createLogger('core-service');

schedule('0 0 * * *', async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  await updateKeycloakMandates(knex, logger);

  await indexMeilisearch(knex, logger);
});

const server = createApolloServer();

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
