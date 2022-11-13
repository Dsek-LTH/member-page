import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .renameTable('event_likes', 'event_coming');
  await knex.schema.table('event_coming', (table) => {
    table.comment('A relation table for members coming to events');
  });
  await knex.schema.createTable('event_interested', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('event_id')
      .unsigned()
      .notNullable()
      .references('events.id')
      .onDelete('CASCADE')
      .comment('The event id');
    t.uuid('member_id')
      .unsigned()
      .notNullable()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member id');
    t.unique(['event_id', 'member_id']);
    t.comment('A relation table for members interested in events');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('event_coming', 'event_likes');
  await knex.schema.table('event_coming', (table) => {
    table.comment('A relation table for likes on events');
  });
  await knex.schema.dropTable('event_interested');
}
