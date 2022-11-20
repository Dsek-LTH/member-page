import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_category', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('product', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('SKU').nullable();
    table.integer('price').notNullable();
    table.string('image_url').notNullable();
    table.uuid('category_id').notNullable().references('product_category.id').onDelete('CASCADE');
    table.integer('max_per_user').notNullable().defaultTo(1000);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('product_discount', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.integer('discount_percentage').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('product_inventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable().references('product.id').onDelete('CASCADE');
    table.uuid('product_discount_id').nullable().references('product_discount.id').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.string('variant').defaultTo('default');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('user_inventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('student_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('user_inventory_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_inventory_id').notNullable().references('user_inventory.id').onDelete('CASCADE');
    table.uuid('student_id').notNullable();
    table.uuid('product_inventory_id').notNullable().references('product_inventory.id').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('payment', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('payment_method').notNullable();
    table.string('payment_status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('order', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('student_id').notNullable();
    table.uuid('payment_id').notNullable().references('payment.id').onDelete('CASCADE');
    table.float('total_price').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('order_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('order_id').notNullable().references('order.id').onDelete('CASCADE');
    table.uuid('product_id').notNullable().references('product.id').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('cart', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('student_id').notNullable();
    table.float('total_price').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at');
  });
  await knex.schema.createTable('cart_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('cart_id').notNullable().references('cart.id').onDelete('CASCADE');
    table.uuid('product_inventory_id').notNullable().references('product_inventory.id').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cart_item');
  await knex.schema.dropTable('cart');
  await knex.schema.dropTable('order_item');
  await knex.schema.dropTable('order');
  await knex.schema.dropTable('payment');
  await knex.schema.dropTable('user_inventory_item');
  await knex.schema.dropTable('user_inventory');
  await knex.schema.dropTable('product_inventory');
  await knex.schema.dropTable('product_discount');
  await knex.schema.dropTable('product');
  await knex.schema.dropTable('product_category');
}
