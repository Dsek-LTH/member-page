import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('from_member').unsigned()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member who sent the initial ping');
    t.uuid('to_member').unsigned()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member who received the initial ping');
    t.unique(['from_member', 'to_member']);
    t.timestamp('from_sent_at').notNullable().defaultTo(knex.fn.now()).comment('When the last ping was sent from the from_member');
    t.timestamp('to_sent_at').comment('When the last ping was sent from the to_member');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.integer('count').unsigned().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('pings');
}
