import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('events_tags', (t) => {
        t.uuid('id')
            .primary()
            .defaultTo(knex.raw('gen_random_uuid()'))
            .notNullable()
        ;
        t.uuid('event_id')
            .unsigned()
            .notNullable()
            .references('events.id')
            .comment('The event id')
        ;
        t.uuid('tag_id')
            .unsigned()
            .notNullable()
            .references('tags.id')
            .comment('The tag id')
        ;
        t.unique(['event_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('events_tags');
}

