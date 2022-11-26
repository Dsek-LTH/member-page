import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('articles', (table) => {
    table.dateTime('relevant_until').comment('The date the article is relevant until');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('articles', (table) => {
    table.dropColumn('relevant_until');
  });
}
