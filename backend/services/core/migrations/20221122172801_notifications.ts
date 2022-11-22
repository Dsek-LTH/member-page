import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('message').notNullable();
    table.string('type').notNullable();
    table.string('link').notNullable();
    table.timestamp('read_at').nullable();
    table.uuid('member_id').notNullable().references('members.id');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('notifications');
}
