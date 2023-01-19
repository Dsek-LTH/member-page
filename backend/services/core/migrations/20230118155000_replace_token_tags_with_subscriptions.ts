import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('token_tags', 'tag_subscriptions');
  await knex.schema.alterTable('tag_subscriptions', (t) => {
    t.uuid('member_id')
      .unsigned()
      .notNullable()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The notification token id');
    t.dropColumn('token_id');
    t.unique(['member_id', 'tag_id']);
    t.comment('A relation table for user subscribed tags');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tag_subscriptions', (t) => {
    t.uuid('token_id')
      .unsigned()
      .notNullable()
      .references('expo_tokens.id')
      .onDelete('CASCADE')
      .comment('The notification token id');
    t.dropUnique(['member_id', 'tag_id']);
    t.dropColumn('member_id');
    t.unique(['token_id', 'tag_id']);
  });
  await knex.schema.renameTable('tag_subscriptions', 'token_tags');
}
