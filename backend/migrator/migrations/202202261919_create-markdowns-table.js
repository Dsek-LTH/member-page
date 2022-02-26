exports.up = (knex) =>
  knex.schema.createTable('markdowns', (t) => {
    t.comment(
      'Custom markdown that should be shown on a page that can be edited by our members',
    );
    t.string('name').primary().comment('Name of the markdown');
    t.text('markdown').notNullable();
    t.text('markdown_en');
  });

exports.down = (knex) => knex.schema.dropTable('markdowns');
