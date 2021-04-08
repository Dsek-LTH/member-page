
exports.up = function(knex) {
  return knex.schema.table('articles', t => {
    t.string('header_en');
    t.text('body_en');
  })
}


exports.down = function(knex) {
  return knex.schema.table('articles', t => {
    t.dropColumn('header_en');
    t.dropColumn('body_en');
  });
}

