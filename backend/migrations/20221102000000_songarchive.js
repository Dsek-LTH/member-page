exports.up = (knex) =>
  knex.schema
    .createTable('songs', (t) => {
      t.comment(
        'Song archive',
      );
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('title').notNullable().comment("The songs's title");
      t.text('lyrics').notNullable().comment('The lyrics of the song');
      t.string('melody').comment("The songs's melody which it is based on");
      t.string('category').comment("The songs's category");
      t.date('created_at').notNullable();
      t.date('updated_at');
    });

exports.down = (knex) => knex.schema
  .dropTable('songs');
