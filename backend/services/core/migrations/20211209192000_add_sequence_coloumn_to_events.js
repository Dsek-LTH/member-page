exports.up = (knex) =>
  knex.schema
    .table('events', (table) => {
      table.integer('number_of_updates').defaultTo(0).comment('How many updates have been preformed on the row');
    });

exports.down = (knex) =>
  knex.schema
    .table('events', (table) => {
      table.dropColumn('number_of_updates');
    });
