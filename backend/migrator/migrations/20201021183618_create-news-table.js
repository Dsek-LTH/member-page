
exports.up = function(knex) {
  return knex.schema.createTable('articles', t => {
    t.comment('News article published');
    t.increments('id').primary().comment('A unique id assigned to every article');
    t.string('header').notNullable();
    t.text('body').notNullable();
    t.integer('author_id').unsigned().notNullable().references('members.id');
    t.dateTime('published_datetime').notNullable();
    t.dateTime('latest_edit_datetime');
  })
}


exports.down = function(knex) {
  return knex.schema.dropTable('articles');
}

