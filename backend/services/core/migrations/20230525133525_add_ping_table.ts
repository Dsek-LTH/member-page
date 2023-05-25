import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('from_member').unsigned()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member who sent the ping');
    t.uuid('to_member').unsigned()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member who sent the ping');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('pings');
}
