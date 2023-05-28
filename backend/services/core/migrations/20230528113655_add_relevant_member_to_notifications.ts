import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notifications', (table) => {
    table.uuid('from_member_id')
      .unsigned()
      .references('members.id')
      .onDelete('SET NULL')
      .comment('The member which took the action that initiated the notification. Null if not relevant.');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notifications', (table) => {
    table.dropColumn('from_member_id');
  });
}
