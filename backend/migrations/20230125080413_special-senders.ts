import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('special_senders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email').notNullable();
    t.string('student_id').notNullable().comment('The username allowed to send');
    t.string('keycloak_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('special_senders');
}
