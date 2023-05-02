import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tag_blacklists', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('member_id')
      .unsigned()
      .notNullable()
      .references('members.id')
      .onDelete('CASCADE');
    t.uuid('tag_id')
      .unsigned()
      .notNullable()
      .references('tags.id')
      .onDelete('CASCADE');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.unique(['member_id', 'tag_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tag_blacklists');
}
