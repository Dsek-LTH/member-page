exports.up = function (knex) {
  return knex.schema.createTable('bookables', t => {
    t.comment('Things that can be booked');
    t.uuid('id').primary().defaultTo(knex.raw('(gen_random_uuid())')).comment('A unique uuid assigned to every bookable');
    t.string('name').comment('Name of the bookable');
    t.string('name_en').comment('Name of the bookable');
  })
}


exports.down = function (knex) {
  return knex.schema.dropTable('bookables');
}
