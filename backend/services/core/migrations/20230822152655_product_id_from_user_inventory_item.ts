import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_inventory_item', (table) => {
    table.uuid('product_id').nullable().references('product.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_inventory_item', (table) => {
    table.dropColumn('product_id');
  });
}
