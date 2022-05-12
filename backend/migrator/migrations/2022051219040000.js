exports.up = (knex) =>
  knex.schema.createTable('expo_tokens', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('member_id').comment('The user who the expo token belongs to.');
    t.string('expo_token').comment('The expo token used to send push notification.');
    t.comment('A table with expo tokens to send push notifications.');
  });

exports.down = (knex) => knex.raw('DROP TABLE expo_tokens CASCADE');
