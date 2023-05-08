import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('governing_documents', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('title').notNullable().comment('The title of the document');
    t.string('url').notNullable().comment('The url of the document');
    t.enum('document_type', ['POLICY', 'GUIDELINE'], { useNative: true, enumName: 'governing_document_type' }).notNullable().comment('The type of document');
    t.timestamps(true, true);
    t.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('governing_documents');
  await knex.raw('DROP TYPE governing_document_type');
}
