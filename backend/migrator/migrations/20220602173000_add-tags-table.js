exports.up = (knex) =>
  knex.schema
    .createTable('tags', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('name').notNullable().comment('The name of the tag');
      t.string('name_en').comment('The english name of the tag');
      t.string('color').comment('The color of the tag');
      t.string('icon').comment('The icon of the tag');
      t.comment('A table for tags on articles');
    })
    .createTable('article_tags', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.uuid('article_id')
        .unsigned()
        .notNullable()
        .references('articles.id')
        .onDelete('CASCADE')
        .comment('The article id');
      t.uuid('tag_id')
        .unsigned()
        .notNullable()
        .references('tags.id')
        .onDelete('CASCADE')
        .comment('The tag id');
      t.unique(['article_id', 'tag_id']);
      t.comment('A relation table for tags on articles');
    });

exports.down = (knex) =>
  knex.raw('DROP TABLE tags, article_tags CASCADE');
