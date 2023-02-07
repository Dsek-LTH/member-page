import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subscription_settings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('member_id')
      .unsigned()
      .notNullable()
      .references('members.id')
      .onDelete('CASCADE');
    t.string('type').notNullable().comment('The type of notification, such as LIKE or COMMENT');
    t.boolean('push_notification').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('subscription_settings');
}
