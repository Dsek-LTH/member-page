import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('positions', (table) => {
    table.dropColumn('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('positions', (table) => {
    table.string('email').comment('Email used to contact the position');
  });
}
