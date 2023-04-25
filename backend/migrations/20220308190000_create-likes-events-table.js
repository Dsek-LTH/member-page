exports.up = (knex) =>
  knex.schema.createTable('event_likes', (t) => {
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
    t.comment('A relation table for likes on events');
  });

exports.down = (knex) => knex.raw('DROP TABLE event_likes CASCADE');
