
exports.up = function(knex) {
  return knex.schema.createTable('bookingRequests', t => {
    t.comment("BookingRequests for events; sv: Bokningsförfrågningar");
    t.increments('id').comment('Unique id assigned to every request')
    t.string("booker_id").unique().comment("The id assigned to the creator of the request");
    t.integer("start").comment("The start-time requested of the booking");
    t.integer("end").comment("The end-time requested of the booking");
    t.integer("created").comment("The time of creation")
    t.string("event").comment("The event");
    t.string("what").comment("Location; The place of the event");
    t.string("status").comment("The status of the request i.e. pending/accepted/denied");
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('bookingRequests')
}