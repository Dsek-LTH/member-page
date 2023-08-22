import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('product_inventory', (table) => {
    table.dropColumn('release_date');
  });
  await knex.schema.alterTable('product', (table) => {
    table.timestamp('release_date').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('product_inventory', (table) => {
    table.timestamp('release_date').defaultTo(knex.fn.now());
  });
  await knex.schema.alterTable('product', (table) => {
    table.dropColumn('release_date');
  });
}
