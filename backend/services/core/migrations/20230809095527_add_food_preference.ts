import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('members', (table) => {
    table.string('food_preference');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('members', (table) => {
    table.dropColumn('food_preference');
  });
}
