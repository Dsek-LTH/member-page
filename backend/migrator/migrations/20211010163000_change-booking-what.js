exports.up = function (knex) {
  return knex.schema
  .createTable('booking_bookables', t => {
    t.uuid('id').primary().defaultTo(knex.raw('(gen_random_uuid())'));
    t.integer('booking_request_id').unsigned().references('booking_requests.id');
    t.uuid('bookable_id').references('bookables.id');
  })
  .table('booking_requests', t => {
    t.dropColumn('what');
  })
}


exports.down = function (knex) {
  return knex.schema
  .alterTable('booking_requests', t => {
    t.string('what').comment('What is beeing booked').alter();
  })
  .dropTable('booking_bookables');
}

