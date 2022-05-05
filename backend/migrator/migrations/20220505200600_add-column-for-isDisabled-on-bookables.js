exports.up = (knex) =>
  knex.schema
    .table('bookables', (table) => {
      table.boolean('isDisabled').notNullable().defaultTo(false).comment('Is the bookable disabled');
    });

exports.down = (knex) =>
  knex.schema
    .table('bookables', (table) => {
      table.dropColumn('isDisabled');
    });
