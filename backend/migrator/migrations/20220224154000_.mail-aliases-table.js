exports.up = (knex) =>
  knex.schema
    .createTable('mail_aliases', (t) => {
      t.comment('Connecting positions with all mail aliases');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('position_id').comment('A unique id assigned to every position e.g. dsek.srd.mastare');
      t.foreign('position_id').references('positions.id')
      t.string('email_alias')
    })

exports.down = (knex) =>
  knex.schema
    .dropTable('mail_aliases');
