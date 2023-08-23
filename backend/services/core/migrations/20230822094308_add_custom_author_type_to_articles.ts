import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add custom authors table
  await knex.schema.createTable('custom_authors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('name_en');
    table.string('image_url');
    table.timestamps(true, true);
  });
  await knex.schema.createTable('custom_author_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('custom_author_id').unsigned().notNullable().references('custom_authors.id')
      .onDelete('CASCADE');
    table.string('role').unsigned().notNullable();
    table.timestamps(true, true);
  });
  // Add new "authors" table
  await knex.schema.createTable('authors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('member_id').notNullable().references('members.id').onDelete('CASCADE');
    table.uuid('mandate_id').unsigned().nullable().references('mandates.id')
      .onDelete('SET NULL');
    table.uuid('custom_id').unsigned().nullable().references('custom_authors.id')
      .onDelete('SET NULL');
    table.timestamps(true, true);
    table.enu('type', ['Member', 'Mandate', 'Custom'], { useNative: true, enumName: 'author_type' }).notNullable().defaultTo('Member');
    table.uuid('temp_article_id').unsigned().notNullable().references('articles.id')
      .comment('Temporary column during migration');
  });
  const memberAuthorArticles = await knex('articles').select('id', 'author_id', 'author_type')
    .where({ author_type: 'Member' });
  const mandateAuthorArticles = await knex('articles').select('articles.id', 'author_id', 'author_type', 'mandates.member_id', 'mandates.id as mandate_id')
    .join('mandates', 'mandates.id', '=', 'articles.author_id')
    .where({ author_type: 'Mandate' });
  // Move all author data from articles to the new table
  if (memberAuthorArticles.length > 0) {
    await knex('authors')
      .insert(memberAuthorArticles.map((article) => ({
        member_id: article.author_id,
        temp_article_id: article.id,
        type: 'Member',
      })));
  }
  if (mandateAuthorArticles.length > 0) {
    await knex('authors')
      .insert(mandateAuthorArticles.map((article) => ({
        member_id: article.member_id,
        mandate_id: article.mandate_id,
        temp_article_id: article.id,
        type: 'Mandate',
      })));
  }
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.id
    FROM authors
    WHERE articles.author_id IS NOT NULL
    AND authors.temp_article_id = articles.id;
  `);

  // remove temp column from author table
  await knex.schema.alterTable('authors', (table) => {
    table.dropColumn('temp_article_id');
  });
  // remove old author columns from articles
  await knex.schema.alterTable('articles', (table) => {
    table.foreign('author_id').references('authors.id').onDelete('SET NULL');
    table.dropColumn('author_type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('articles', (table) => {
    table.dropForeign('author_id');
    table.string('author_type').notNullable().defaultTo('Member').comment('What type the author is (e.g. Member and Mandate)');
  });
  await knex
    .update({ author_id: knex.raw('authors.member_id'), author_type: 'Member' })
    .from('articles')
    .join('authors', 'authors.id', '=', 'articles.author_id')
    .where({ 'authors.type': 'Member' });
  await knex
    .update({ author_id: knex.raw('authors.mandate_id'), author_type: 'Mandate' })
    .from('articles')
    .join('authors', 'authors.id', '=', 'articles.author_id')
    .where({ 'authors.type': 'Mandate' });
  await knex.schema.dropTable('authors');
  await knex.schema.dropTable('custom_author_positions');
  await knex.schema.dropTable('custom_authors');
}
