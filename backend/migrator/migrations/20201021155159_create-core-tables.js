
exports.up = function(knex) {
  return knex.schema
    .createTable("members", t => {
      t.comment("All persons who are, or have been, members of D-sektionen");
      t.increments("id").primary().comment("A unique id assigned to every member");
      t.string("student_id").unique().comment("The id assigned to the student by the university");
      t.string("first_name").comment("The member's first name");
      t.string("nickname").comment("The member's nickname");
      t.string("last_name").comment("The member's last name");
      t.string("class_programme").comment("The programme the member studie[s/d] e.g. D, C");
      t.string("class_year").comment("The year the member started studying the programme");
    })
    .createTable("committees", t => {
      t.comment("Committees the guild has; sv: Utskott");
      t.increments("id").primary().comment("A unique id assigned to every committee");
      t.string("name").unique().comment("The committee's name");
      t.string("name_en").unique().comment("The committee's name in English");
    })
    .createTable("positions", t => {
      t.comment("Positions the guild has; sv: Poster");
      t.increments("id").primary().comment("A unique id assigned to every position");
      t.string("name").comment("The position's name");
      t.string("name_en").comment("The position's name in English");
      t.integer("committee_id").unsigned().references("committees.id");
    })
    .createTable("mandates", t => {
      t.comment("The current and past mandates");
      t.integer("member_id").unsigned().notNullable().references("members.id");
      t.integer("position_id").unsigned().notNullable().references("positions.id");
      t.date("start_date").notNullable().comment("The mandate's start date");
      t.date("end_date").notNullable().comment("The mandate's end date");
      t.primary(["member_id", "position_id"]);
    })
}


exports.down = function(knex) {
  return knex.schema
    .dropTable("mandates")
    .dropTable("positions")
    .dropTable("committees")
    .dropTable("members")
}

