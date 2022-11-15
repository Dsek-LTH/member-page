import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookables', (t) => {
    t.string('door').nullable().comment('Door that this bookable gives access to');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookables', (t) => {
    t.dropColumn('door');
  });
}
