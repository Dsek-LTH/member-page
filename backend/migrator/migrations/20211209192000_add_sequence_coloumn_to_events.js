exports.up = function (knex) {
  return knex.schema
    .table('events', function (table) {
      table.integer('number_of_updates').defaultTo(0).comment("How many updates have been preformed on the row");
    })

}

exports.down = function (knex) {
  return knex.schema
    .table('events', function (table) {
      table.dropColumn('number_of_updates');
    })
}
