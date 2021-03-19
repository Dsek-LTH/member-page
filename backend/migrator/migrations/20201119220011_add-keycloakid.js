exports.up = function(knex) {
  return knex.schema.createTable('keycloak', t => {
    t.string('keycloak_id').primary().comment('The id assigned to a person in keycloak');
    t.integer('member_id').unsigned().comment('The member id for the same person');
    t.comment('A relation table for connecting keycloak accounts with a member')
  });
}


exports.down = function(knex) {
  return knex.schema.droptable('keycloak');
}

