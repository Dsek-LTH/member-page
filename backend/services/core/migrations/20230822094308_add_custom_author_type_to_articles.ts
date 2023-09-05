import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add custom authors table
  await knex.schema.createTable('custom_authors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().comment('Swedish name of custom author');
    table.string('name_en').comment('English name of custom author, possibly null');
    table.string('image_url').comment('Image url of custom author, possibly null');
    table.timestamps(true, true);
  });
  await knex.schema.createTable('custom_author_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('custom_author_id').unsigned().notNullable().references('custom_authors.id')
      .onDelete('CASCADE');
    table.string('role').unsigned().notNullable().comment('should use role syntax, such as dsek.styr or dsek.stab.noll');
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

    table.check(`type = 'Member' AND mandate_id IS NULL AND custom_id IS NULL
      OR type = 'Mandate' AND mandate_id IS NOT NULL AND custom_id IS NULL
      OR type = 'Custom' AND mandate_id IS NULL AND custom_id IS NOT NULL`, undefined, 'enforce_author_type');
  });
  // Get all articles posted by a member, not as a mandate
  const memberAuthorArticles = await knex('articles').select('id', 'author_id', 'author_type', 'published_datetime', 'latest_edit_datetime')
    .where({ author_type: 'Member' });
  // Get all articles posted as a mandate
  const mandateAuthorArticles = await knex('articles').select('articles.id', 'author_id', 'author_type', 'mandates.member_id', 'mandates.id as mandate_id', 'published_datetime', 'latest_edit_datetime')
    .join('mandates', 'mandates.id', '=', 'articles.author_id')
    .where({ author_type: 'Mandate' });
  // Create rows in authors table for each article posted as a member
  if (memberAuthorArticles.length > 0) {
    await knex('authors')
      .insert(memberAuthorArticles.map((article) => ({
        member_id: article.author_id,
        temp_article_id: article.id,
        type: 'Member',
        created_at: article.published_datetime,
        updated_at: article.latest_edit_datetime,
      })));
  }
  // Create rows in authors table for each article posted as a mandate
  if (mandateAuthorArticles.length > 0) {
    await knex('authors')
      .insert(mandateAuthorArticles.map((article) => ({
        member_id: article.member_id,
        mandate_id: article.mandate_id,
        temp_article_id: article.id,
        type: 'Mandate',
        created_at: article.published_datetime,
        updated_at: article.latest_edit_datetime,
      })));
  }
  // Update all articles to point to the newly created author rows,
  // using the temporary article_id column
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
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.member_id
    FROM authors
    WHERE authors.id = articles.author_id
    AND authors.type = 'Member'
  `);
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.mandate_id
    FROM authors
    WHERE authors.id = articles.author_id
    AND authors.type = 'Mandate'
  `);
  await knex.schema.dropTable('authors');
  await knex.schema.dropTable('custom_author_roles');
  await knex.schema.dropTable('custom_authors');
  await knex.schema.raw('DROP TYPE author_type');
}
