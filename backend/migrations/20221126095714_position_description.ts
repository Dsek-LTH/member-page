import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('positions', (table) => {
    table.text('description');
    table.text('description_en');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('positions', (table) => {
    table.dropColumn('description');
    table.dropColumn('description_en');
  });
}
