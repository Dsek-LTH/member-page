exports.up = function (knex) {
  return knex.schema
    .table('positions', function (table) {
      table.string('email').comment("Email used to contact the position");
      table.boolean('active').notNullable().defaultTo(true).comment("Is the position currently active");
      table.boolean('board_member').notNullable().defaultTo(false).comment("Is the position a board member");
    })
    .table('members', function (table) {
      table.boolean('visible').notNullable().defaultTo(true).comment("Is the member visible on page");
    })
    .table('committees', function (table) {
      table.boolean('short_name').comment("Identifier for the committee");
    });
}

exports.down = function (knex) {
  return knex.schema
    .table('positions', function (table) {
      table.dropColumn('email');
      table.dropColumn('active');
      table.dropColumn('board_member');
    })
    .table('members', function (table) {
      table.dropColumn('visible');
    })
    .table('committees', function (table) {
      table.dropColumn('short_name');
    });
}
