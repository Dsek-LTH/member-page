exports.up = (knex) =>
  knex.schema
    .table('mandates', (table) => {
      table.boolean('in_keycloak').notNullable().defaultTo(false).comment('This is a flag to indicate if the user is in keycloak');
    });

exports.down = (knex) =>
  knex.schema
    .table('mandates', (table) => {
      table.dropColumn('in_keycloak');
    });
