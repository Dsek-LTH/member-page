import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tags', (table) => {
    table.dropColumn('icon');
    table.boolean('is_default').defaultTo(false).comment('If new users should be automatically subscribed to this tag');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tags', (table) => {
    table.string('icon');
    table.dropColumn('is_default');
  });
}
