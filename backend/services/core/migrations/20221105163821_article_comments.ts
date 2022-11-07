import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('article_comments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('article_id')
      .unsigned()
      .notNullable()
      .references('articles.id')
      .onDelete('CASCADE')
      .comment('The article id');
    t.uuid('member_id')
      .unsigned()
      .notNullable()
      .references('members.id')
      .onDelete('CASCADE')
      .comment('The member id');
    t.comment('A relation table for comments on news articles');
    t.string('content').comment('The actual comment');
    t.dateTime('published').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE article_likes CASCADE');
}
