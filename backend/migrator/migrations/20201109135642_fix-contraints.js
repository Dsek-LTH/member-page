const committeesComment = "The committee's name";
const positionsComment = "The position's name";
exports.up = function(knex) {
  return knex.schema.table('committees', t => {
    t.string('name').notNullable().comment(committeesComment).alter();
  }).table('positions', t => {
    t.string('name').notNullable().comment(positionsComment).alter();
  })
}


exports.down = function(knex) {
  return knex.schema.table('positions', t => {
    t.string('name').nullable().comment(positionsComment).alter();
  }).table('committees', t => {
    t.string('name').nullable().comment(committeesComment).alter();
  });
}

