import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('bookable_categories', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('(gen_random_uuid())'));
      t.string('name').notNullable();
      t.string('name_en').nullable();
    })
    .table('bookables', (t) => {
      t.uuid('category_id').references('id').inTable('bookable_categories');
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('bookable_categories')
    .table('bookables', (t) => {
      t.dropColumn('category_id');
    });
}
