
exports.up = function(knex) {
  return knex.schema.table('events', t => {
    t.string('slug');
    t.string('short_description');
  })
}


exports.down = function(knex) {
  return knex.schema.table('events', t => {
    t.dropColumn('slug');
    t.dropColumn('short_description');
  });
}

