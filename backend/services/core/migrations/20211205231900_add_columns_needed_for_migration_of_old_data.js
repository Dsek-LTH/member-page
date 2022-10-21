exports.up = (knex) =>
  knex.schema
    .table('positions', (table) => {
      table.string('email').comment('Email used to contact the position');
      table.boolean('active').notNullable().defaultTo(true).comment('Is the position currently active');
      table.boolean('board_member').notNullable().defaultTo(false).comment('Is the position a board member');
    })
    .table('members', (table) => {
      table.boolean('visible').notNullable().defaultTo(true).comment('Is the member visible on page');
    })
    .table('committees', (table) => {
      table.string('short_name').comment('Identifier for the committee');
    });

exports.down = (knex) =>
  knex.schema
    .table('positions', (table) => {
      table.dropColumn('email');
      table.dropColumn('active');
      table.dropColumn('board_member');
    })
    .table('members', (table) => {
      table.dropColumn('visible');
    })
    .table('committees', (table) => {
      table.dropColumn('short_name');
    });
