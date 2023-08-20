import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events_tags', (t) => {
    t.dropUnique(['event_id']);
    t.unique(['event_id', 'tag_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events_tags', (t) => {
    t.dropUnique(['event_id', 'tag_id']);
    t.unique(['event_id']);
  });
}
