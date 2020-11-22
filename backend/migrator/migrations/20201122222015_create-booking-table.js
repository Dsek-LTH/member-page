
exports.up = function(knex) {
  return knex.schema.createTable('bookingRequests', t => {
    t.comment('Table containing a booking requests')
    t.increments('id').comment('Unique id assigned to every request')
    //TODO: Add all fields that should be part of the table
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('bookingRequests')
}