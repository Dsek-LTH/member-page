exports.up = function(knex) {
    return knex.schema.createTable('events', t => {
      t.comment('Event published');
      t.increments('id').primary().comment('A unique id assigned to every event');
      t.string('title').notNullable();
      t.text('description').notNullable();
      t.string('link');
      t.dateTime('start_datetime').notNullable();
      t.dateTime('end_datetime').notNullable();
    })
  }
  
  
exports.down = function(knex) {
  return knex.schema.dropTable('events');
}
