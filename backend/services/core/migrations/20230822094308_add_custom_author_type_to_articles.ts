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
  await knex.schema;
  // Add new "authors" table
  await knex.schema.createTable('authors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('member_id').notNullable().references('members.id').onDelete('CASCADE');
    table.uuid('mandate_id').unsigned().nullable().references('mandates.id')
      .onDelete('SET NULL');
    table.uuid('custom_id').unsigned().nullable().references('custom_authors.id')
      .onDelete('SET NULL');
    table.timestamps(true, true);

    table.check(`mandate_id IS NULL AND custom_id IS NULL
      OR (mandate_id IS NOT NULL AND custom_id IS NULL)
      OR (mandate_id IS NULL AND custom_id IS NOT NULL)`, undefined, 'enforce_author_type');
    table.unique(['member_id', 'mandate_id', 'custom_id']).comment('Only one author per member, mandate or custom author');
  });
  // add "type column" which is generated based on the other ones
  await knex.raw(`
    ALTER TABLE authors ADD COLUMN type VARCHAR GENERATED ALWAYS AS (
      CASE
          WHEN mandate_id IS NULL AND custom_id IS NULL THEN 'Member'
          WHEN mandate_id IS NOT NULL AND custom_id IS NULL THEN 'Mandate'
          WHEN mandate_id IS NULL AND custom_id IS NOT NULL THEN 'Custom'
      END
  ) STORED`);
  // Get all articles posted by a member, not as a mandate
  const memberAuthors = await knex('articles').distinct('author_id')
    .where({ author_type: 'Member' })
    .distinct('author_id');
  // Get all articles posted as a mandate
  const mandateAuthors = await knex('articles').distinct('author_id as mandate_id', 'mandates.member_id')
    .join('mandates', 'mandates.id', '=', 'articles.author_id')
    .where({ author_type: 'Mandate' });
  // Create rows in authors table for each article posted as a member
  if (memberAuthors.length > 0) {
    await knex('authors')
      .insert(memberAuthors.map((author) => ({
        member_id: author.author_id,
      })));
  }
  // Create rows in authors table for each article posted as a mandate
  if (mandateAuthors.length > 0) {
    await knex('authors')
      .insert(mandateAuthors.map((author) => ({
        member_id: author.member_id,
        mandate_id: author.mandate_id,
      })));
  }
  // Update all articles to point to the newly created author rows,
  // using the temporary article_id column
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.id
    FROM authors
    WHERE articles.author_id IS NOT NULL
    AND articles.author_type = 'Member'
    AND authors.member_id = articles.author_id
    AND authors.type = 'Member'
  `);
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.id
    FROM authors
    WHERE articles.author_id IS NOT NULL
    AND articles.author_type = 'Mandate'
    AND authors.mandate_id = articles.author_id
    AND authors.type = 'Mandate'
  `);

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
    author_type = 'Member'
    FROM authors
    WHERE authors.id = articles.author_id
    AND authors.type = 'Member'
  `);
  await knex.raw(`
    UPDATE articles
    SET author_id = authors.mandate_id
    author_type = 'Mandate'
    FROM authors
    WHERE authors.id = articles.author_id
    AND authors.type = 'Mandate'
  `);
  await knex.schema.dropTable('authors');
  await knex.schema.dropTable('custom_author_roles');
  await knex.schema.dropTable('custom_authors');
  await knex.schema.raw('DROP TYPE author_type');
}
