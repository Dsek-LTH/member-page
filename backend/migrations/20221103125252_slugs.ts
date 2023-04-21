import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('articles', (table) => {
    table.string('slug').unique().comment('Slugified title used for urls');
  });
  await knex.schema.table('events', (table) => {
    table.string('slug').unique().comment('Slugified title used for urls');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('articles', (table) => {
    table.dropColumn('slug');
  });
  await knex.schema.table('events', (table) => {
    table.dropColumn('slug');
  });
}
