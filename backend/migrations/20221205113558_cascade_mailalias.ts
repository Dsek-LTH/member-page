import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('ALTER TABLE email_aliases DROP CONSTRAINT mail_aliases_position_id_foreign');
  await knex.schema.alterTable('email_aliases', (table) => {
    table.foreign('position_id').references('positions.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('email_aliases', (table) => {
    table.dropForeign('position_id');
    table.foreign('position_id').references('positions.id');
  });
}
