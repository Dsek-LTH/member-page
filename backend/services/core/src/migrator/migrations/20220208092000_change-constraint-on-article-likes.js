exports.up = (knex) =>
  knex.schema
    .table('article_likes', (table) => {
      table.dropUnique('article_id');
      table.dropUnique('member_id');
      table.unique(['article_id', 'member_id']);
    });

exports.down = (knex) =>
  knex.schema
    .table('article_likes', (table) => {
      table.unique('article_id');
      table.unique('member_id');
      table.dropUnique(['article_id', 'member_id']);
    });
