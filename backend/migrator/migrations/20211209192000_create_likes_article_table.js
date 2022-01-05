exports.up = (knex) =>
  knex.schema
    .createTable('article_likes', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.uuid('article_id').unsigned().notNullable().references('articles.id').onDelete('CASCADE').unique().comment('The article id');
      t.uuid('member_id').unsigned().notNullable().references('members.id').onDelete('CASCADE').unique().comment('The member id');
      t.comment('A relation table for likes on news articles');
    });

exports.down = (knex) =>
  knex.raw('DROP TABLE article_likes CASCADE');
