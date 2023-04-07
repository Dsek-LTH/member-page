import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('article_requests', (table) => {
    table.uuid('article_id').unsigned().nullable().references('articles.id')
      .comment('Article which was created from this request, null if still draft or article was published directly');
    table.timestamp('approved_datetime').nullable().comment('Timestamp when article request was approved');
    table.timestamp('rejected_datetime').nullable().comment('Timestamp when article request was rejected');
    table.text('rejection_reason').nullable().comment('Optional reason set by admin when rejecting an article request.');
    table.uuid('approved_by').unsigned().nullable().references('members.id')
      .comment('Admin which approved request, null if still draft or article was published directly');

    table.boolean('should_send_notification').defaultTo(false).comment('If a notification should be sent to tag followers when the request is published');
    table.string('notification_body').nullable().comment('Optional notification body to be sent to tag followers when the request is published');
    table.string('notification_body_en').nullable().comment('Optional notification body to be sent to tag followers when the request is published (English)');
  });
  await knex.schema.alterTable('articles', (table) => {
    table.enu('status', ['draft', 'approved', 'rejected']).defaultTo('draft').comment('Article is initially a request (draft), if not created by an admin. Admins can either approve or reject.');

    table.timestamp('published_datetime').nullable().alter().comment('Timestamp when article was published, null if still draft or article was published directly');
    table.timestamp('created_datetime').notNullable().defaultTo(knex.fn.now()).comment('Represents the time when an article is created, MIGHT be different from published_datetime if not yet published');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('article_requests');
  await knex.schema.alterTable('articles', (table) => {
    table.dropColumn('status');
    table.timestamp('published_datetime').notNullable().alter();
    table.dropColumn('created_datetime');
  });
}
