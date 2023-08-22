import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('product', (table) => {
    table.decimal('price', 8, 2).notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('product', (table) => {
    table.integer('price').notNullable().alter();
  });
}
