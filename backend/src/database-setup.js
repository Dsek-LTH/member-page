//Setup for dummy database used during development
function setup(knex) {
knex.schema
  .dropTableIfExists('members')
  .dropTableIfExists('committees')
  .dropTableIfExists('positions')
  .dropTableIfExists('mandates')
  .dropTableIfExists('articles')
  .createTable('members', table => {
    table.string('stil_id').primary();
    table.string('name').notNullable();
    table.string('programme').notNullable();
    table.integer('first_year').notNullable();
  })
  .createTable('committees', table => {
    table.string('committee_title').primary();
    table.string('committee_title_en');
  })
  .createTable('positions', table => {
    table.string('position_title').primary();
    table.string('position_title_en');
    table.string('committee_title').references('committees.committee_title');
  })
  .createTable('mandates', table => {
    table.string('stil_id').notNullable().references('members.stil_id');
    table.string('position_title').notNullable().references('positions.position_title');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
  })
  .createTable('articles', table => {
    table.increments('article_id').primary();
    table.string('header').notNullable();
    table.string('body').notNullable();
    table.string('author_stil_id').notNullable();
    table.datetime('published_datetime').notNullable();
    table.datetime('latest_edit_datetime')
  })
  .then(() =>
    knex('members').insert([
      { 'stil_id': 'dat15ewi', 'name': 'Emil Wihlander', 'programme': 'D', 'first_year': 2015, },
      { 'stil_id': 'dat15fno', 'name': 'Fred Nordell', 'programme': 'D', 'first_year': 2016, },
    ])
  )
  .then(() =>
    knex('committees').insert([
      { 'committee_title': 'Cafémästeriet', },
      { 'committee_title': 'Näringslivsutskottet', },
      { 'committee_title': 'Källarmästeriet', },
      { 'committee_title': 'Aktivitetsutskottet', },
      { 'committee_title': 'Informationsutskottet', },
      { 'committee_title': 'Sexmästeriet', },
      { 'committee_title': 'Skattmästeriet', },
      { 'committee_title': 'Studierådet', },
      { 'committee_title': 'Nollningsutskottet', },
    ])
  )
  .then(() =>
    knex('articles').insert([
      { 'header': 'Detta är en nyhet från maj', 'body': 'Detta är mer ingående information om nyheten', 'author_stil_id': 'dat15ewi', 'published_datetime': '2020-05-20T12:20:02.000Z', },
      { 'header': 'Detta är en redigerad nyhet', 'body': 'Detta är mer ingående information om nyheten som är redigerad', 'author_stil_id': 'dat15ewi', 'published_datetime': '2020-06-20T12:20:02.000Z', 'latest_edit_datetime': '2020-06-21T12:20:02.000Z', },
      { 'header': 'Detta är en nyhet från Fred', 'body': 'Detta är mer ingående information om nyheten från Fred', 'author_stil_id': 'dat15fno', 'published_datetime': '2020-07-20T12:20:02.000Z', },
    ])
  )
  .then(() =>
    knex('positions').insert([
      { 'position_title': 'Dagsansvarig', 'committee_title': 'Cafémästeriet', },
      { 'position_title': 'DWWW-ansvarig', 'committee_title': 'Informationsutskottet', },
      { 'position_title': 'Fotograf', 'committee_title': 'Informationsutskottet', },
      { 'position_title': 'Artist', 'committee_title': 'Informationsutskottet', },
      { 'position_title': 'Funktionär inom Skattmästeriet', 'committee_title': 'Skattmästeriet', },
      { 'position_title': 'Skattmästare', 'committee_title': 'Skattmästeriet', },
      { 'position_title': 'sudo', 'committee_title': 'Källarmästeriet', },
      { 'position_title': 'Tandemgeneral', 'committee_title': 'Aktivitetsutskottet', },
      { 'position_title': 'Nollningsfunktionär', 'committee_title': 'Nollningsutskottet', },
      { 'position_title': 'Sektionskock', 'committee_title': 'Sexmästeriet', },
      { 'position_title': 'Vinförman', 'committee_title': 'Sexmästeriet', },
    ])
  )
  .then(() =>
    knex('mandates').insert([
      { 'stil_id': 'dat15ewi', 'position_title': 'Dagsansvarig', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'DWWW-ansvarig', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Fotograf', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Funktionär inom Skattmästeriet', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'sudo', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Tandemgeneral', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Nollningsfunktionär', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Vinförman', 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Skattmästare', 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
      { 'stil_id': 'dat15ewi', 'position_title': 'Sektionskock', 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
    ])
  )
  .catch(e => {
    console.error(e);
  });
}

module.exports = setup;