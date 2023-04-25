import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('songs', (table) => {
    // make created_at and updated_at dateTime instead of date
    table.dateTime('created_at').alter();
    table.dateTime('updated_at').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('songs', (table) => {
    table.date('created_at').alter();
    table.date('updated_at').alter();
  });
}
