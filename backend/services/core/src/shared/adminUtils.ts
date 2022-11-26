import { Knex } from 'knex';
import { Index } from 'meilisearch';
import { Logger } from 'winston';
import keycloakAdmin from '../keycloak';
import meilisearch from './meilisearch';

// function to add data to index in chunks of 500
const addDataToIndexByChunks = async (index: Index, data: any[], size: number = 500) => {
  for (let i = 0; i < data.length; i += size) {
    // eslint-disable-next-line no-await-in-loop
    await index.addDocuments(data.slice(i, i + size));
  }
};

/* eslint-disable import/prefer-default-export */
export async function updateKeycloakMandates(
  knex: Knex,
  logger: Logger,
) {
  logger.info('Updating keycloak mandates');

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString()
    .substring(0, 10);

  const expiredMandates = await knex('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '<', yesterday).where({ in_keycloak: true })
    .select('keycloak_id', 'position_id', 'mandates.id');
  logger.info(`Found ${expiredMandates.length} expired mandates.`);

  const mandatesToAdd = await knex<{ keycloak_id: string, position_id: string }>('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '>', today)
    .select('keycloak.keycloak_id', 'mandates.position_id', 'mandates.id');
  logger.info(`Found ${mandatesToAdd.length} mandates to add.`);

  logger.info('Updating keycloak...');
  await Promise.all(mandatesToAdd.map((mandate) => keycloakAdmin
    .createMandate(mandate.keycloak_id, mandate.position_id)
    .then(async () => {
      await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: true });
      logger.info(`Created mandate ${mandate.keycloak_id}->${mandate.position_id}`);
    })
    .catch(() => logger.info(`Failed to create mandate ${mandate.keycloak_id}->${mandate.position_id}`))));

  await Promise.all(expiredMandates.map((mandate) => keycloakAdmin
    .deleteMandate(mandate.keycloak_id, mandate.position_id)
    .then(async () => {
      await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: false });
      logger.info(`Deleted mandate ${mandate.keycloak_id}->${mandate.position_id}`);
    })
    .catch(() => logger.info(`Failed to delete mandate ${mandate.keycloak_id}->${mandate.position_id}`))));
  logger.info('Done updating mandates');
}

export async function indexMembersMeilisearch(knex: Knex, logger: Logger) {
  logger.info('Indexing members in meilisearch.');
  try {
    await meilisearch.deleteIndexIfExists('members');
    const members = await knex.select('id', 'student_id', 'first_name', 'nickname', 'last_name', 'picture_path').from('members');
    const index = meilisearch.index('members');
    await addDataToIndexByChunks(index, members);
    logger.info('Meilisearch members index successful');
    return true;
  } catch (e: any) {
    logger.info('Meilisearch members index failed');
    logger.error(e);
    return false;
  }
}

export async function indexEventsMeilisearch(knex: Knex, logger: Logger) {
  logger.info('Indexing events in meilisearch.');
  try {
    await meilisearch.deleteIndexIfExists('events');
    const events = await knex
      .select('id', 'slug', 'title', 'title_en', 'location', 'organizer', 'description', 'description_en', 'short_description', 'short_description_en', 'start_datetime', 'end_datetime')
      .from('events')
      .whereNull('removed_at');
    const index = meilisearch.index('events');
    addDataToIndexByChunks(index, events);
    logger.info('Meilisearch events index successful');
    return true;
  } catch (e: any) {
    logger.info('Meilisearch events index failed');
    logger.error(e);
    return false;
  }
}

export async function indexArticlesMeilisearch(knex: Knex, logger: Logger) {
  logger.info('Indexing articles in meilisearch.');
  try {
    await meilisearch.deleteIndexIfExists('articles');
    const articles = await knex
      .select('id', 'header', 'header_en', 'body', 'body_en', 'slug', 'image_url', 'author_id', 'author_type', 'published_datetime')
      .from('articles').whereNull('removed_at');
    const index = meilisearch.index('articles');
    await addDataToIndexByChunks(index, articles);
    logger.info('Meilisearch articles index successful');
    return true;
  } catch (e: any) {
    logger.info('Meilisearch articles index failed');
    logger.error(e);
    return false;
  }
}

export async function indexMeilisearch(knex: Knex, logger: Logger) {
  logger.info('Indexing meilisearch.');
  try {
    await indexMembersMeilisearch(knex, logger);
    await indexEventsMeilisearch(knex, logger);
    await indexArticlesMeilisearch(knex, logger);
    return true;
  } catch (e: any) {
    logger.info('Meilisearch index failed');
    logger.error(e);
    return false;
  }
}
