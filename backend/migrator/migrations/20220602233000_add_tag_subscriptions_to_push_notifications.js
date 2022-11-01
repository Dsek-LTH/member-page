exports.up = (knex) =>
  knex.schema
    .createTable('token_tags', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.uuid('token_id')
        .unsigned()
        .notNullable()
        .references('expo_tokens.id')
        .onDelete('CASCADE')
        .comment('The notification token id');
      t.uuid('tag_id')
        .unsigned()
        .notNullable()
        .references('tags.id')
        .onDelete('CASCADE')
        .comment('The tag id');
      t.unique(['token_id', 'tag_id']);
      t.comment('A relation table for subscribed tags on notification tokens');
    });

exports.down = (knex) =>
  knex.raw('DROP TABLE token_tags CASCADE');
