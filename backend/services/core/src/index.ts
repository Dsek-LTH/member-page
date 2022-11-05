import { schedule } from 'node-cron';
import {
  knex, createLogger, meilisearch,
} from './shared';
import createApolloServer from './server';
import kcClient from './keycloak';

const logger = createLogger('core-service');

schedule('0 0 * * *', async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  logger.info('Updating keycloak mandates');

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

  const expiredMandates = await knex('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '<', yesterday).where({ in_keycloak: true })
    .select('keycloak_id', 'position_id', 'mandates.id');
  logger.info(`Found ${expiredMandates.length} expired mandates.`);

  const mandatesToAdd = await knex<{ keycloak_id: string, position_id: string }>('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '>', yesterday).where({ in_keycloak: false })
    .select('keycloak.keycloak_id', 'mandates.position_id', 'mandates.id');
  logger.info(`Found ${mandatesToAdd.length} mandates to add.`);

  logger.info('Updating keycloak...');
  await Promise.all(mandatesToAdd.map((mandate) => kcClient
    .createMandate(mandate.keycloak_id, mandate.position_id)
    .then(async () => {
      await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: true });
      logger.info(`Created mandate ${mandate.keycloak_id}->${mandate.position_id}`);
    })
    .catch(() => logger.info(`Failed to create mandate ${mandate.keycloak_id}->${mandate.position_id}`))));

  await Promise.all(expiredMandates.map((mandate) => kcClient
    .deleteMandate(mandate.keycloak_id, mandate.position_id)
    .then(async () => {
      await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: false });
      logger.info(`Deleted mandate ${mandate.keycloak_id}->${mandate.position_id}`);
    })
    .catch(() => logger.info(`Failed to delete mandate ${mandate.keycloak_id}->${mandate.position_id}`))));
  logger.info('Done updating mandates');

  logger.info('Indexing members in meilisearch.');
  try {
    await meilisearch.deleteIndexIfExists('members');
    const members = await knex.select('id', 'student_id', 'first_name', 'nickname', 'last_name', 'picture_path').from('members');
    const index = meilisearch.index('members');
    await index.addDocuments(members);
    logger.info('Meilisearch index successful');
  } catch {
    logger.info('Meilisearch index failed');
  }
});

const server = createApolloServer();

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
