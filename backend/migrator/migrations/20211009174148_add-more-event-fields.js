exports.up = function (knex) {
  return knex.schema.table("events", (t) => {
    t.string("title_en");
    t.string("location");
    t.string("organizer").notNullable();
    t.integer("author_id").unsigned().notNullable().references("members.id");
    t.string("description_en");
    t.string("short_description").notNullable();
    t.string("short_description_en");
  });
};

exports.down = function (knex) {
  return knex.schema.table("events", (t) => {
    t.dropColumn("title_en");
    t.dropColumn("location");
    t.dropColumn("organizer").notNullable();
    t.dropColumn("author_id").unsigned().notNullable().references("members.id");
    t.dropColumn("description_en");
    t.dropColumn("short_description").notNullable();
    t.dropColumn("short_description_en");
  });
};
