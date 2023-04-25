import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.string('questions');// freetext
    table.string('alternatives');// alterrnative 
  }
  )
  await knex.schema.createTable('product_answer', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('question_id').notNullable;
    table.uuid('respondent_id').notNullable;
    table.string('question_answers');
    table.string('alternative_answers');
  })
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('product_questions');
  knex.schema.dropTable('product_answer');
}

