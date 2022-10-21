exports.up = (knex) =>
  knex.schema
    .table('articles', (table) => {
      table.dropForeign('author_id');
      table.string('author_type').notNullable().defaultTo('Member').comment('What type the author is (e.g. Member and Mandate)');
    });

exports.down = (knex) =>
  knex.schema
    .table('articles', (table) => {
      table.foreign('author_id').references('members.id');
      table.dropColumn('author_type');
    });
