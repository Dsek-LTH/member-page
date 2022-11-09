import { Knex } from 'knex';
import MeiliSearch from 'meilisearch';

export default async function meilisearchSeed(knex: Knex, meilisearch: MeiliSearch) {
  await meilisearch.deleteIndexIfExists('members');
  const members = await knex.select('id', 'student_id', 'first_name', 'nickname', 'last_name', 'picture_path').from('members');
  const index = meilisearch.index('members');
  await index.addDocuments(members);
}
