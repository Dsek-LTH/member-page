import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('email_aliases', (table) => {
    table.boolean('can_send').comment('Whether the alias can send emails or not. Defaults to false if not set.').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('email_aliases', (table) => {
    table.dropColumn('can_send');
  });
}
