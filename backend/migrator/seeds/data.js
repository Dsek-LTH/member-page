
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('articles').del();
  await knex('mandates').del();
  await knex('positions').del();
  await knex('committees').del();
  await knex('members').del();

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
    },
  ]);
  const [emil, fred] = idToArray(2, memberId);
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
  ]);
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
  ]);
  const positions = idToArray(11, positionsId);
  await knex('mandates').insert([
    { 'member_id': emil, 'position_id': positions[0], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[1], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[2], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[3], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[4], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[5], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[6], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[7], 'start_date': '2020-01-01', 'end_date': '2020-12-31', },
    { 'member_id': emil, 'position_id': positions[8], 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
    { 'member_id': emil, 'position_id': positions[9], 'start_date': '2019-01-01', 'end_date': '2019-12-31', },
  ])

  await knex('articles').insert([
    {
      'header': 'Detta är en nyhet från maj',
      'body': 'Detta är mer ingående information om nyheten',
      'author_id': emil,
      'published_datetime': '2020-05-20 12:20:02',
    },{
      'header': 'Detta är en redigerad nyhet',
      'body': 'Detta är mer ingående information om nyheten som är redigerad',
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
};
