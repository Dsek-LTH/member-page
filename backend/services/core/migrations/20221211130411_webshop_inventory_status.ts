import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_inventory_item', (table) => {
    table.string('status').notNullable().defaultTo('PAID');
    table.uuid('product_id').notNullable().references('product.id').onDelete('CASCADE');
    table.timestamp('deleted_at').nullable();
    table.timestamp('delivered_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_inventory_item', (table) => {
    table.dropColumn('status');
    table.dropColumn('product_id');
    table.dropColumn('deleted_at');
    table.dropColumn('delivered_at');
  });
}
