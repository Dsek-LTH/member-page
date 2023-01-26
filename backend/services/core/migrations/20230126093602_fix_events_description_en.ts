import { Knex } from 'knex';

/**
 * the column description_en has
 * incorrectly been set to the type string
 * but it should have been text
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.text('description_en').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.string('description_en').alter();
  });
}
