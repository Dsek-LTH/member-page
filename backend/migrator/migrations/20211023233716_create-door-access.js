
exports.up = function(knex) {
  return knex.schema
    .createTable('doors', t => {
      t.comment('All doors that access policies can be assigned to.')
      t.string('name').primary().comment('The name of the door.');
      t.string('id').comment('The school assigned id of the door, e.g. E:1234.');
    })
    .createTable('door_access_policies', t => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('door_name').notNullable().references('doors.name');
      t.string('role');
      t.string('student_id');
    })
    .createTable('api_access_policies', t => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('api_name').notNullable();
      t.string('role');
      t.string('student_id');
    });
}


exports.down = function(knex) {
  return knex.schema
    .dropTable('doors')
    .dropTable('door_access_policies')
    .dropTable('api_access_policies');
}
