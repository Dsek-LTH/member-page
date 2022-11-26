import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.timestamp('removed_at');
  });
  await knex.schema.alterTable('articles', (table) => {
    table.timestamp('removed_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.dropColumn('removed_at');
  });
  await knex.schema.alterTable('articles', (table) => {
    table.dropColumn('removed_at');
  });
}
