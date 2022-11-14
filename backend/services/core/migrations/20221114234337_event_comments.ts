import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('event_comments', (t) => {
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
    t.comment('A relation table for comments on events');
    t.text('content').comment('The actual comment');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE event_comments CASCADE');
}
