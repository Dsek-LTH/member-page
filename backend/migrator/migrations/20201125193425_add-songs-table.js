
exports.up = (knex) => {
  return knex.schema.createTable('songs', t => {
    t.increment('id').primary().comment('A unique id assigned to every song');
    t.string('name').notNullable().comment('Name of the song');
    //TODO: Other fields needed
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('songs');
}