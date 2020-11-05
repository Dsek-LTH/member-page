
exports.up = function(knex) {
  return knex.schema.table('members', t => {
    t.string('picture_path');
  })
}


exports.down = function(knex) {
  return knex.schema.table('members', t => {
    t.dropColumn('picture_path');
  });
}

