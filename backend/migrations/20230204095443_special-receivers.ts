import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('special_receivers', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email').notNullable().comment('The email that will forward');
    t.string('target_email').notNullable().comment('The email that will receive the forwarded email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('special_receivers');
}
