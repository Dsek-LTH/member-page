import { schedule } from 'node-cron';
import {
  knex, createLogger,
} from './shared';
import createApolloServer from './server';
import keycloakAdmin from './keycloak';
import meilisearchAdmin from './shared/meilisearch';

const logger = createLogger('core-service');

schedule('0 0 * * *', async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  await keycloakAdmin.updateKeycloakMandates(knex);

  await meilisearchAdmin.indexMeilisearch(knex);
});

const server = createApolloServer();

const port = process.env.PORT || 4000;

server.listen(port).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
