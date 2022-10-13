exports.up = (knex) =>
  knex.schema
    .table('committees', (table) => {
      table.string('slug').comment("The committee's slug");
    });

exports.down = (knex) =>
  knex.schema
    .table('committees', (table) => {
      table.dropColumn('slug');
    });
