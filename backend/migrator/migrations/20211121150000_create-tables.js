exports.up = (knex) =>
  knex.schema
    .createTable('members', (t) => {
      t.comment('All persons who are, or have been, members of D-sektionen');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('student_id').unique().comment('The id assigned to the student by the university');
      t.string('first_name').comment("The member's first name");
      t.string('nickname').comment("The member's nickname");
      t.string('last_name').comment("The member's last name");
      t.string('picture_path');
      t.string('class_programme').comment('The programme the member studie[s/d] e.g. D, C');
      t.integer('class_year').comment('The year the member started studying the programme');
    })
    .createTable('committees', (t) => {
      t.comment('Committees the guild has; sv: Utskott');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('name').notNullable().comment("The committee's name");
      t.string('name_en').comment("The committee's name in English");
    })
    .createTable('positions', (t) => {
      t.comment('Positions the guild has; sv: Poster');
      t.string('id').primary().comment('A unique id assigned to every position e.g. dsek.srd.mastare');
      t.string('name').notNullable().comment("The positions's name");
      t.string('name_en').comment("The position's name in English");
      t.uuid('committee_id').unsigned().references('committees.id');
    })
    .createTable('mandates', (t) => {
      t.comment('The current and past mandates');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.uuid('member_id').unsigned().notNullable().references('members.id');
      t.string('position_id').notNullable().references('positions.id');
      t.date('start_date').notNullable().comment("The mandate's start date");
      t.date('end_date').notNullable().comment("The mandate's end date");
    })
    .createTable('keycloak', (t) => {
      t.string('keycloak_id').primary().comment('The id assigned to a person in keycloak');
      t.uuid('member_id').unsigned().comment('The member id for the same person');
      t.comment('A relation table for connecting keycloak accounts with a member');
    })
    .createTable('articles', (t) => {
      t.comment('News article published');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('header').notNullable();
      t.string('header_en');
      t.text('body').notNullable();
      t.text('body_en');
      t.string('image_url');
      t.uuid('author_id').unsigned().notNullable().references('members.id');
      t.dateTime('published_datetime').notNullable();
      t.dateTime('latest_edit_datetime');
    })
    .createTable('booking_requests', (t) => {
      t.comment('Booking requests for events');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.uuid('booker_id').unsigned().comment('The id assigned to the creator of the request');
      t.datetime('start').comment('The start-time requested of the booking');
      t.datetime('end').comment('The end-time requested of the booking');
      t.datetime('created').defaultTo(knex.fn.now()).comment('The time of creation');
      t.string('event').comment('The event');
      t.string('status').comment('The status of the request i.e. pending/accepted/denied');
    })
    .createTable('bookables', (t) => {
      t.comment('Things that can be booked');
      t.uuid('id').primary().defaultTo(knex.raw('(gen_random_uuid())')).comment('A unique uuid assigned to every bookable');
      t.string('name').notNullable().comment('Name of the bookable');
      t.string('name_en').comment('Name of the bookable');
    })
    .createTable('booking_bookables', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('(gen_random_uuid())'));
      t.uuid('booking_request_id').unsigned().references('booking_requests.id');
      t.uuid('bookable_id').references('bookables.id');
    })
    .createTable('events', (t) => {
      t.comment('Event published');
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('title').notNullable();
      t.string('title_en');
      t.text('description').notNullable();
      t.string('description_en');
      t.string('link');
      t.string('location');
      t.string('organizer').notNullable();
      t.uuid('author_id').unsigned().notNullable().references('members.id');
      t.string('short_description').notNullable();
      t.string('short_description_en');
      t.dateTime('start_datetime').notNullable();
      t.dateTime('end_datetime').notNullable();
    })
    .createTable('doors', (t) => {
      t.comment('All doors that access policies can be assigned to.');
      t.string('name').primary().comment('The name of the door.');
      t.string('id').comment('The school assigned id of the door, e.g. E:1234.');
    })
    .createTable('door_access_policies', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('door_name').notNullable().references('doors.name');
      t.string('role');
      t.string('student_id');
    })
    .createTable('api_access_policies', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      t.string('api_name').notNullable();
      t.string('role');
      t.string('student_id');
    });

exports.down = (knex) =>
  knex.schema
    .dropTable('api_access_policies')
    .dropTable('door_access_policies')
    .dropTable('doors')
    .dropTable('events')
    .dropTable('booking_bookables')
    .dropTable('bookables')
    .dropTable('booking_requests')
    .dropTable('articles')
    .dropTable('keycloak')
    .dropTable('mandates')
    .dropTable('positions')
    .dropTable('committees')
    .dropTable('members');
