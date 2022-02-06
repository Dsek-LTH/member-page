exports.up = (knex) =>
  knex.schema
    .table('door_access_policies', (table) => {
      table.dateTime('start_datetime');
      table.dateTime('end_datetime');
    });

exports.down = (knex) =>
  knex.schema
    .table('door_access_policies', (table) => {
      table.dropColumn('start_datetime');
      table.dropColumn('end_datetime');
    });
