import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tags', (table) => {
        table.string('name_en').notNullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tags', (table) => {
        table.string('name_en').nullable().alter();
    });
}
