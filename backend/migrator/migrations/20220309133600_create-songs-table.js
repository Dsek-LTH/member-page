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
      t.string('category_slug').comment("The songs's category");
      t.date('created_at');
      t.date('updated_at');
    })
    .createTable('categories', (t) => {
      t.comment('Song categories');
      t.string('slug').unique().notNullable().comment("The category's slug");
      t.string('title').notNullable().comment("The category's title");
      t.string('description').comment("The category's description");
    });

exports.down = (knex) => knex.schema
  .dropTable('songs')
  .dropTable('categories');
