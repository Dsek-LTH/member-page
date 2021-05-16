
exports.up = function(knex) {
  return knex.schema.table('articles', t => {
    t.string('image_url');
  })
}


exports.down = function(knex) {
  return knex.schema.table('articles', t => {
    t.dropColumn('image_url');
  });
}

