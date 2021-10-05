
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('articles').del();
  await knex('mandates').del();
  await knex('positions').del();
  await knex('committees').del();
  await knex('members').del();
  await knex('keycloak').del();
  await knex('booking_requests').del();

  const idToArray = (length, id) => (length > 0) ? [...idToArray(length - 1, id), id + length - 1] : []

  // Inserts seed entries
  const [memberId] = await knex('members').insert([
    {
      'student_id': 'dat15ewi',
      'first_name': 'Emil',
      'last_name': 'Wihlander',
      'class_programme': 'D',
      'class_year': 2015,
      'picture_path': '/static/members/pictures/emil.jpg',
    },{
      'student_id': 'dat15fno',
      'first_name': 'Fred',
      'last_name': 'Nordell',
      'class_programme': 'D',
      'class_year': 2016,
    },{
      'student_id': 'no1774ma-s',
      'first_name': 'Noah',
      'last_name': 'Mayerhofer',
      'class_programme': 'D',
      'class_year': 2017,
    },
    {
      'student_id': 'lu3021bo-s',
      'first_name': 'Lucas',
      'last_name': 'Boberg',
      'class_programme': 'D',
      'class_year': 2020,
    },
    {
      'student_id': 'ma7022ku-s',
      'first_name': 'Maria',
      'last_name': 'Kulesh',
      'class_programme': 'D',
      'class_year': 2020,
    },
    {
      'student_id': 'ol1662le-s',
      'first_name': 'Oliver',
      'last_name': 'Levay',
      'class_programme': 'D',
      'class_year': 2021,
    },
  ]).returning('id');
  const [emil, fred, noah, lucas, maria, oliver] = idToArray(6, memberId);
  const [committeesId] = await knex('committees').insert([
    { 'name': 'Cafémästeriet', },
    { 'name': 'Näringslivsutskottet', },
    { 'name': 'Källarmästeriet', },
    { 'name': 'Aktivitetsutskottet', },
    { 'name': 'Informationsutskottet', },
    { 'name': 'Sexmästeriet', },
    { 'name': 'Skattmästeriet', },
    { 'name': 'Studierådet', },
    { 'name': 'Nollningsutskottet', },
  ]).returning('id');
  const [cafe, nari, kall, aktu, infu, sex, skatt, srd, nollu ] = idToArray(9, committeesId);
  const [ positionsId ] = await knex('positions').insert([
    { 'name': 'Dagsansvarig', 'committee_id': cafe, },
    { 'name': 'DWWW-ansvarig', 'committee_id': infu, },
    { 'name': 'Fotograf', 'committee_id': infu, },
    { 'name': 'Funktionär inom Skattmästeriet', 'committee_id': skatt, },
    { 'name': 'sudo', 'committee_id': kall, },
    { 'name': 'Tandemgeneral', 'committee_id': aktu, },
    { 'name': 'Nollningsfunktionär', 'committee_id': nollu, },
    { 'name': 'Vinförman', 'committee_id': sex, },
    { 'name': 'Sektionskock', 'committee_id': sex, },
    { 'name': 'Skattmästare', 'committee_id': skatt, },
    { 'name': 'Artist', 'committee_id': infu, },
  ]).returning('id');
  const positions = idToArray(11, positionsId);
  await knex('mandates').insert([
    { 'member_id': emil, 'position_id': positions[0], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': lucas, 'position_id': positions[1], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[2], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[3], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[4], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[5], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[6], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[7], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[8], 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
    { 'member_id': emil, 'position_id': positions[9], 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
  ]);

  await knex('articles').insert([
    {
      'header': 'Detta är en nyhet från maj',
      'header_en': 'This is news from may',
      'body': 'Detta är mer ingående information om nyheten',
      'body_en': 'This more information about the news',
      'author_id': emil,
      'published_datetime': '2020-05-20 12:20:02',
    },{
      'header': 'Detta är en redigerad nyhet',
      'header_en': 'This is an edited article',
      'body': 'Detta är mer ingående information om nyheten som är redigerad',
      'body_en': 'This more information about the article that is edited',
      'author_id': emil,
      'published_datetime': '2020-06-20 12:20:02',
      'latest_edit_datetime': '2020-06-21 12:20:02',
    },{
      'header': 'Detta är en nyhet från Fred',
      'body': 'Detta är mer ingående information om nyheten från Fred',
      'author_id': fred,
      'published_datetime': '2020-07-20 12:20:02',
    },
  ]);

  await knex('keycloak').insert([
    {
      member_id: emil,
      keycloak_id: '089965a5-05bd-4271-ad92-d1ede7f54564',
    },
    {
      member_id: fred,
      keycloak_id: '2eed06cc-6c18-48de-9a06-6616744cc624',
    },
    {
      member_id: noah,
      keycloak_id: '88142f8e-a0d1-42fc-b486-758f56b114e4',
    },
    {
      member_id: lucas,
      keycloak_id: '6dc34d33-2e94-4333-ac71-4df6cd029e1c',
    },
    {
      member_id: maria,
      keycloak_id: '164298da-fb22-4732-b790-080cac4cb542',
    },
    {
      member_id: oliver,
      keycloak_id: '39183db7-c91d-4c68-be35-eced3342ccf3'
    }
  ])

  await knex('events').insert([
    {
      'title': 'Event 1',
      'description': 'Beskrivning av event 1',
      'start_datetime': '2021-03-27 19:30:02',
      'end_datetime': '2021-03-29 19:30:02',
    },
    {
      'title': 'Event 2',
      'description': 'Beskrivning av event 2',
      'start_datetime': '2021-03-29 10:30:01',
      'end_datetime': '2021-04-15 19:30:00',
    }
  ]);

  await knex('booking_requests').insert([
    {
      'booker_id': emil,
      'start': '2021-01-13 21:00',
      'end': '2021-01-13 22:00',
      'event': 'Överlämning',
      'what': 'iDét',
      'status': 'ACCEPTED'
    },{
      'booker_id': fred,
      'start': '2022-01-10 10:00',
      'end': '2022-01-12 22:00',
      'event': 'Framtiden',
      'what': 'Styrelserummet',
      'status': 'PENDING'
    },
    {
      'booker_id': noah,
      'start': '2022-01-01 00:00',
      'end': '2022-01-01 23:59',
      'event': 'Nyår',
      'what': 'Köket',
      'status': 'PENDING'
    },
  ])
};
