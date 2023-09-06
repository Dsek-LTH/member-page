import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notifications', (table) => {
    table.uuid('from_author_id')
      .unsigned()
      .references('authors.id')
      .onDelete('SET NULL')
      .comment('The author which took the action that initiated the notification. Null if not relevant.');
  });
  const membersWithoutAuthor = await knex('notifications')
    .distinct('notifications.from_member_id')
    .leftJoin('authors', 'authors.member_id', '=', 'notifications.from_member_id')
    .whereNotNull('notifications.from_member_id')
    .andWhere('authors.type', 'Member')
    .whereNull('authors.id');
  if (membersWithoutAuthor.length > 0) {
    await knex.insert(membersWithoutAuthor.map((member) => ({
      member_id: member.from_member_id,
      type: 'Member',
    }))).into('authors');
  }
  await knex.raw(`
    UPDATE notifications
    SET from_author_id = authors.id
    FROM authors
    WHERE notifications.from_member_id = authors.member_id
    AND authors.type = 'Member'
  `);
  await knex.schema.alterTable('notifications', (table) => {
    table.dropColumn('from_member_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notifications', (table) => {
    table.uuid('from_member_id')
      .unsigned()
      .references('members.id')
      .onDelete('SET NULL')
      .comment('The author which took the action that initiated the notification. Null if not relevant.');
  });
  await knex.raw(`
    UPDATE notifications
    SET from_member_id = authors.member_id
    FROM authors
    WHERE notifications.from_author_id = authors.id
    AND authors.type = 'Member'
  `);
  await knex.schema.alterTable('notifications', (table) => {
    table.dropColumn('from_author_id');
  });
}
