import { context, knex, createLogger } from 'dsek-shared';
import { schedule } from 'node-cron';
import createApolloServer from './server';
import dataSources from './datasources';
import kcClient from './keycloak';

const logger = createLogger('core-service');

schedule('0 0 * * *', async () => {
  logger.info('Updating keycloak mandates');

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const newMandates = await knex<{keycloak_id: string, position_id: string}>('mandates').join('keycloak', 'mandates.member_id', 'keycloak.member_id').where({ start_date: today.toISOString().substring(0, 10) }).select('keycloak_id', 'position_id');
  logger.info(`Found ${newMandates.length} new mandates`);

  const oldMandates = await knex('mandates').join('keycloak', 'mandates.member_id', 'keycloak.member_id').where({ end_date: yesterday.toISOString().substring(0, 10) }).select('keycloak_id', 'position_id');
  logger.info(`Found ${oldMandates.length} old mandates`);

  logger.info('Updating keycloak...');
  await Promise.all(newMandates.map((mandate) => kcClient
    .createMandate(mandate.keycloak_id, mandate.position_id)
    .then(() => logger.info(`Added mandate ${mandate.keycloak_id}->${mandate.position_id}`))
    .catch(() => logger.info(`Failed to add mandate ${mandate.keycloak_id}->${mandate.position_id}`))));

  await Promise.all(oldMandates.map((mandate) => kcClient
    .deleteMandate(mandate.keycloak_id, mandate.position_id)
    .then(() => logger.info(`Added mandate ${mandate.keycloak_id}->${mandate.position_id}`))
    .catch(() => logger.info(`Failed to add mandate ${mandate.keycloak_id}->${mandate.position_id}`))));
  logger.info('Done updating mandates');
});

const server = createApolloServer(context.deserializeContext, dataSources);

server.listen({ port: 4000 }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
