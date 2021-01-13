
exports.up = function(knex) {
  return knex.schema.createTable('booking_requests', t => {
    t.comment('Booking requests for events; sv: Bokningsförfrågningar');
    t.increments('id').comment('Unique id assigned to every request')
    t.integer('booker_id').unsigned().comment('The id assigned to the creator of the request');
    t.datetime('start').comment('The start-time requested of the booking');
    t.datetime('end').comment('The end-time requested of the booking');
    t.datetime('created').defaultTo(knex.fn.now()).comment('The time of creation')
    t.string('event').comment('The event');
    t.string('what').comment('What is beeing booked');
    t.string('status').comment('The status of the request i.e. pending/accepted/denied');
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('bookingRequests')
}