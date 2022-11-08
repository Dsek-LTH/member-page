import type Knex from 'knex';
import { slugify } from '../src/shared/utils';
import { Bookable, BookingBookables, BookingRequest } from '~/src/types/booking';
import {
  Committee, Door, DoorAccessPolicy, Keycloak, MailAlias, Mandate, Member, Position,
} from '~/src/types/database';
import { Event } from '~/src/types/events';
import {
  Article, Comment, Like, Markdown, Tag, Token,
} from '~/src/types/news';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex) => {
  // Deletes ALL existing entries
  await knex('events').del();
  await knex('articles').del();
  await knex('mandates').del();
  await knex('email_aliases').del();
  await knex('positions').del();
  await knex('committees').del();
  await knex('members').del();
  await knex('keycloak').del();
  await knex('booking_bookables').del();
  await knex('booking_requests').del();
  await knex('bookables').del();
  await knex('door_access_policies').del();
  await knex('doors').del();
  await knex('markdowns').del();
  await knex('tags').del();
  await knex('expo_tokens').del();
  await knex('article_comments').del();
  await knex('article_likes').del();

  await knex<Markdown>('markdowns').insert([
    {
      name: 'cafe',
      markdown: 'Hej jag är liten fisk',
      markdown_en: 'Hi I am a little fish',
    },
  ]);

  await knex<Token>('expo_tokens').insert([
    {
      expo_token: 'ExponentPushToken[fWnsFpAaa8nKkN6nNOBE90]',
    },
    {
      expo_token: 'ExponentPushToken[fXhg-iO1jKPSbIRSRhbePd]',
    },
  ]);

  // Inserts seed entries
  const memberIds = await knex<Member>('members').insert([
    {
      student_id: 'dat15ewi',
      first_name: 'Emil',
      last_name: 'Wihlander',
      class_programme: 'D',
      class_year: 2015,
      picture_path: 'https://avatars.githubusercontent.com/u/3393586?v=4',
    }, {
      student_id: 'dat15fno',
      first_name: 'Fred',
      last_name: 'Nordell',
      class_programme: 'D',
      class_year: 2016,
      picture_path: 'https://frednordell.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fface2.7a3c0dc4.jpg&w=640&q=75',
    }, {
      student_id: 'no1774ma-s',
      first_name: 'Noah',
      last_name: 'Mayerhofer',
      class_programme: 'D',
      class_year: 2017,
      picture_path: 'https://noahmay.com/img/noah.jpg',
    },
    {
      student_id: 'lu3021bo-s',
      first_name: 'Lucas',
      last_name: 'Boberg',
      class_programme: 'D',
      class_year: 2020,
      picture_path: 'https://media-exp1.licdn.com/dms/image/C4D03AQGkZbmS7E4tJw/profile-displayphoto-shrink_200_200/0/1566842448354?e=1669852800&v=beta&t=D2TY--FuSBSqh368TWP9C1a7Fb9o5ji-6RVIkgqBZz0',
    },
    {
      student_id: 'ma7022ku-s',
      first_name: 'Maria',
      last_name: 'Kulesh',
      class_programme: 'D',
      class_year: 2020,
    },
    {
      student_id: 'ol1662le-s',
      first_name: 'Oliver',
      last_name: 'Levay',
      nickname: 'olivoljan',
      class_programme: 'D',
      class_year: 2021,
      picture_path: 'https://minio.api.dsek.se/members/public/ol1662le-s/oliver%20profilbild7135.jpg',
    },
    {
      student_id: 'lu4185sv-s',
      first_name: 'Ludvig',
      last_name: 'Svedberg',
      class_programme: 'D',
      class_year: 2020,
      picture_path: 'https://media-exp1.licdn.com/dms/image/C4D03AQFFgrbVOraz4Q/profile-displayphoto-shrink_800_800/0/1660928086954?e=2147483647&v=beta&t=HzzWoF7C4-L5eGtapFtwVm3cdYS9A8cVusYMRUJmrFY',
    },
  ]).returning('id');

  const committeesIds = await knex<Committee>('committees').insert([
    { name: 'Cafémästeriet', short_name: 'cafe' },
    { name: 'Näringslivsutskottet', short_name: 'nari' },
    { name: 'Källarmästeriet', short_name: 'km' },
    { name: 'Aktivitetsutskottet', short_name: 'aktu' },
    { name: 'Informationsutskottet', short_name: 'infu' },
    { name: 'Sexmästeriet', short_name: 'sexm' },
    { name: 'Skattmästeriet', short_name: 'skattm' },
    { name: 'Studierådet', short_name: 'srd' },
    { name: 'Nollningsutskottet', short_name: 'nollu' },
  ]).returning('id');
  const positions = await knex<Position>('positions').insert([
    { id: 'dsek.cafe.dagsansv', name: 'Dagsansvarig', committee_id: committeesIds[0] },
    { id: 'dsek.infu.dwww.mastare', name: 'DWWW-ansvarig', committee_id: committeesIds[4] },
    {
      id: 'dsek.infu.fotograf', name: 'Fotograf', name_en: 'Photographer', committee_id: committeesIds[4],
    },
    { id: 'dsek.skattm.funk', name: 'Funktionär inom Skattmästeriet', committee_id: committeesIds[6] },
    { id: 'dsek.km.rootm.sudo', name: 'sudo', committee_id: committeesIds[2] },
    { id: 'dsek.aktu.tandemgen', name: 'Tandemgeneral', committee_id: committeesIds[3] },
    { id: 'dsek.noll.funk', name: 'Nollningsfunktionär', committee_id: committeesIds[8] },
    { id: 'dsek.sex.vinfm', name: 'Vinförman', committee_id: committeesIds[5] },
    {
      id: 'dsek.sex.sektkock', name: 'Sektionskock', committee_id: committeesIds[5], board_member: true,
    },
    { id: 'dsek.skattm.mastare', name: 'Skattmästare', committee_id: committeesIds[6] },
    { id: 'dsek.infu.artist', name: 'Artist', committee_id: committeesIds[4] },
    {
      id: 'dsek.infu.dwww', name: 'DWWW-medlem', committee_id: committeesIds[4], board_member: true,
    },
    { id: 'dsek.infu.dwww-king', name: 'DWWW-king', committee_id: null },
  ]).returning('id');

  const mandates = await knex<Mandate>('mandates').insert([
    {
      member_id: memberIds[0], position_id: positions[0], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[3], position_id: positions[1], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[2], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[3], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[4], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[5], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[6], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[7], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[8], start_date: new Date('2019-01-01'), end_date: new Date('2019-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[9], start_date: new Date('2019-01-01'), end_date: new Date('2019-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positions[11], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[2], position_id: positions[11], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[5], position_id: positions[1], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[3], position_id: positions[11], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[4], position_id: positions[11], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[6], position_id: positions[1], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[6], position_id: positions[11], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
  ]).returning('id');

  const articleIds = await knex<Article>('articles').insert([
    {
      header: 'Detta är en nyhet från maj',
      header_en: 'This is news from may',
      body: 'Detta är mer ingående information om nyheten',
      body_en: 'This more information about the news',
      author_id: mandates[0],
      author_type: 'Mandate',
      published_datetime: new Date('2020-05-20 12:20:02'),
      slug: slugify('Detta är en nyhet från maj'),
    }, {
      header: 'Detta är en redigerad nyhet',
      header_en: 'This is an edited article',
      body: 'Detta är mer ingående information om nyheten som är redigerad',
      body_en: 'This more information about the article that is edited',
      author_id: memberIds[0],
      published_datetime: new Date('2020-06-20 12:20:02'),
      latest_edit_datetime: new Date('2020-06-21 12:20:02'),
      slug: slugify('Detta är en redigerad nyhet'),
    }, {
      header: 'Detta är en nyhet från Fred',
      body: 'Detta är mer ingående information om nyheten från Fred',
      author_id: memberIds[1],
      published_datetime: new Date('2020-07-20 12:20:02'),
      slug: slugify('Detta är en nyhet från Fred'),
    },
    {
      header: 'Detta är en mycket lång nyhet från Oliver',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed sem in quam accumsan semper eget convallis neque. Vestibulum ut aliquam tellus. Mauris sit amet arcu tortor. In in sapien et lectus egestas lobortis non eu ipsum. Vestibulum lorem quam, aliquet ac lacus ut, viverra finibus diam. Praesent ac dui ut enim faucibus accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce malesuada eros sed semper gravida. Fusce tristique mattis lectus at interdum. Phasellus pellentesque lacus a tempor egestas. Sed ut augue vitae quam dignissim euismod et ac quam. Nunc bibendum tincidunt lacus quis accumsan.\n\nVivamus eu suscipit velit. Nullam condimentum urna nisi, eget tempus mi luctus vel. Vivamus sit amet odio ut lectus interdum blandit sed id sem. Maecenas tristique eget ipsum vitae tincidunt. Vivamus finibus arcu at metus fringilla, at ultricies tellus finibus. Ut laoreet, nisi quis eleifend lobortis, enim felis eleifend lacus, vel iaculis sapien enim vel leo. Quisque rutrum imperdiet lectus eu gravida. In hac habitasse platea dictumst.\n      \nSed pellentesque aliquet dolor, quis lacinia nulla fermentum vitae. Suspendisse enim tellus, sagittis et facilisis a, vulputate ac nulla. Morbi interdum lorem sapien, vitae vestibulum lacus ultricies ac. Sed sed nisi viverra quam blandit accumsan quis ut ex. Etiam sapien metus, viverra vitae tortor non, porttitor placerat tellus. Donec dolor ligula, vehicula ut ligula et, laoreet aliquet nibh. Aliquam cursus sed eros ut finibus. Aliquam eros eros, accumsan ac mauris non, aliquam convallis est. Fusce fermentum facilisis elementum. Nunc at porttitor velit. Vivamus ut nulla at eros tincidunt commodo. Donec sed metus vitae turpis semper elementum id quis elit. Donec nibh mauris, sodales sit amet enim eget, bibendum consectetur nisi. Aliquam aliquam et est eget hendrerit.\n      \nPellentesque ac lacus id lacus pretium placerat et et nulla. Morbi enim est, consectetur non luctus ut, eleifend id felis. Suspendisse potenti. Maecenas euismod, turpis in sagittis egestas, magna ligula tempus lacus, sollicitudin tristique libero mi a mauris. Sed accumsan, eros vitae fringilla scelerisque, lectus lacus tincidunt est, eu tempor ligula velit ac dui. Maecenas ultrices lectus sapien, nec faucibus dolor varius eget. Nunc sed purus varius, lobortis urna finibus, lobortis sapien. Sed ut magna semper, eleifend lectus non, pretium metus. Aliquam ac efficitur ligula, nec fringilla erat. Donec eu vulputate libero, auctor ornare mi. Mauris accumsan enim a elit gravida semper. Sed non convallis lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent maximus, est sed bibendum pretium, lorem nulla ullamcorper erat, in auctor nisi lectus in sem. Nulla facilisi. Nulla vulputate feugiat ex, ut sodales purus suscipit a.\n      \nDonec molestie nunc lacus, id mattis nunc scelerisque eu. Aliquam pharetra nec sapien aliquam facilisis. Etiam ut placerat tortor. Suspendisse ac consequat libero, a dignissim dui. Donec porta molestie pharetra. Vestibulum vestibulum viverra sapien nec efficitur. Vivamus id lectus non velit tincidunt scelerisque. Nulla facilisi. Mauris vulputate, eros vel commodo pulvinar, mauris turpis faucibus mauris, convallis ullamcorper nisi felis in dolor. Maecenas posuere justo et nibh iaculis ornare. Fusce dignissim urna ut nulla consectetur, et finibus mi pellentesque. Nullam sagittis porta justo, pulvinar luctus ante egestas sed. Cras aliquet bibendum tempus. Suspendisse at posuere lorem.\n      \nProin vulputate nisl in urna tempus, ut varius sapien lobortis. Donec fringilla, sapien ac blandit pellentesque, ante velit maximus erat, auctor mollis leo ligula nec mauris. Proin sagittis metus in vestibulum molestie. Proin sagittis lectus non ipsum vulputate, in mattis purus posuere. Praesent ut odio eu nisi interdum placerat sed et metus. Nulla tristique at nisl non ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras posuere rhoncus tellus, at tempor nisi vehicula vitae. Pellentesque scelerisque sapien in bibendum rhoncus.\n      \nAliquam consequat sodales quam, quis scelerisque risus consequat eget. Aliquam erat volutpat. Integer non semper eros. Integer suscipit ut sem vel interdum. Suspendisse pellentesque hendrerit nibh. Pellentesque varius ipsum non feugiat sollicitudin. In eget sem finibus, ullamcorper lacus quis, pretium est. Phasellus fringilla turpis ac nisl efficitur malesuada. Maecenas id fringilla dolor, in viverra ante. Donec velit odio, luctus in bibendum vitae, feugiat non diam. Curabitur magna tellus, varius vel odio quis, suscipit volutpat ligula. Cras efficitur metus velit, id aliquam tellus aliquam eu. Nunc metus ante, eleifend ac ornare sed, fermentum a ipsum.\n      \nCras rutrum ipsum id diam porta blandit. Praesent tristique augue vel congue varius. Aenean ex tellus, dignissim non leo quis, vehicula lobortis elit. Curabitur hendrerit nunc ut tortor porta, et tempor erat viverra. Fusce laoreet condimentum libero, quis condimentum mauris rhoncus ac. Duis nec enim et nibh elementum pretium. Proin eu volutpat tellus. Nullam eget enim sagittis, pulvinar nunc sed, imperdiet justo.\n      \nNam non egestas turpis. Cras in leo in lectus vehicula tristique et ac ipsum. Vestibulum egestas urna eget dui rhoncus ultrices at sit amet urna. Praesent et mauris a velit condimentum sodales ac eu nunc. Ut vel viverra purus. Integer id lacus a libero viverra pretium in ut lectus. Aliquam consectetur nisl orci, at porta nisi pretium vel. Praesent dignissim purus et magna hendrerit tristique. Suspendisse at sapien nec odio commodo facilisis at non sapien. In non sem gravida, dictum eros cursus, condimentum mauris. Quisque ultricies, nibh id tincidunt euismod, eros ligula imperdiet quam, id posuere lorem metus ut ipsum. Praesent finibus finibus sem. Donec venenatis metus non tortor imperdiet, eget sollicitudin mi facilisis. Cras maximus molestie quam, a condimentum ligula suscipit non.\n      \nUt consectetur arcu eget quam fermentum, a ultrices turpis aliquet. Vestibulum molestie mi varius turpis consectetur, at ullamcorper neque sodales. Fusce ullamcorper erat ut nisi malesuada pretium. Sed libero turpis, euismod sit amet bibendum et, auctor quis nulla. Mauris porta vitae ex id tincidunt. Vivamus vitae porttitor ipsum. Quisque purus nulla, venenatis non dapibus vel, malesuada a nibh. Maecenas aliquet enim in urna accumsan, eu feugiat ante sagittis. Pellentesque in tristique augue. Morbi quis purus ac diam pellentesque condimentum vitae sed libero.',
      author_id: memberIds[5],
      published_datetime: new Date('2020-07-21 12:20:02'),
      slug: slugify('Detta är en mycket lång nyhet från Oliver'),
    },
  ]).returning('id');

  await knex<Comment>('article_comments').insert([
    {
      member_id: memberIds[0],
      article_id: articleIds[3],
      content: 'Wow! Vad coolt att man kan kommentera nu! [@Oliver "olivoljan" Levay](/members/ol1662le-s)',
      published: new Date('2022-11-05'),
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[3],
      content: 'Detta är en cool kommentar',
      published: new Date('2022-11-04'),
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[3],
      content: 'Visst är det? [@Emil Wihlander](/members/dat15ewi)',
      published: new Date('2022-11-06'),
    },
  ]);

  await knex<Like>('article_likes').insert([
    {
      member_id: memberIds[0],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[1],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[3],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[6],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[0],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[1],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[1],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[1],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[0],
    },
  ]);

  await knex<Keycloak>('keycloak').insert([
    {
      member_id: memberIds[0],
      keycloak_id: '089965a5-05bd-4271-ad92-d1ede7f54564',
    },
    {
      member_id: memberIds[1],
      keycloak_id: '2eed06cc-6c18-48de-9a06-6616744cc624',
    },
    {
      member_id: memberIds[2],
      keycloak_id: '88142f8e-a0d1-42fc-b486-758f56b114e4',
    },
    {
      member_id: memberIds[3],
      keycloak_id: '526583e8-b4eb-4ac6-9291-43fe94218278',
    },
    {
      member_id: memberIds[4],
      keycloak_id: '164298da-fb22-4732-b790-080cac4cb542',
    },
    {
      member_id: memberIds[5],
      keycloak_id: '39183db7-c91d-4c68-be35-eced3342ccf3',
    },
    {
      member_id: memberIds[6],
      keycloak_id: '4eeb75d0-19e1-4a06-81d1-593baf34dfc0',
    },
  ]);

  await knex<Event>('events').insert([
    {
      title: 'DWWW LAN',
      title_en: 'very english title',
      description: 'Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 ',
      description_en: 'very english description',
      location: 'iDét',
      organizer: 'DWWW',
      author_id: memberIds[5],
      short_description: 'Beskrivning av event 1',
      short_description_en: 'Description of event 1',
      link: 'https://dsek.se',
      start_datetime: '2021-10-09 09:00:00',
      end_datetime: '2021-10-10 20:00:00',
    },
    {
      title: 'Event 2',
      description: 'Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 ',
      short_description: 'Beskrivning av event 2',
      start_datetime: '2021-03-29 10:30:01',
      end_datetime: '2021-04-15 19:30:00',
      link: 'https://google.se',
      author_id: memberIds[3],
      organizer: 'Lucas',
    },
  ]);

  await knex<Tag>('tags').insert([
    {
      name: 'Gratis mat',
      name_en: 'Free food',
      icon: 'Restaurant',
      color: '#00ab28',
    },
    {
      name: 'Företagsevent',
      name_en: 'Company event',
      icon: 'Business',
      color: '#18a0c5',
    },
    {
      name: 'Viktigt',
      name_en: 'Important',
      icon: 'PriorityHigh',
      color: '#ff2727d8',
    },
    {
      name: 'Stora evenemang',
      name_en: 'Big events',
      icon: 'Groups',
      color: '#F280A1',
    },
  ]);

  const bookableIds = await knex<Bookable>('bookables').insert([
    {
      name: 'Uppehållsdelen av iDét',
      name_en: 'Commonroom part of iDét',
    },
    {
      name: 'Köket',
      name_en: 'The Kitchen',
    },
    {
      name: 'Styrelserummet',
      name_en: 'The boardroom',
    },
    {
      name: 'Shäraton (det lilla rummet)',
      name_en: 'Shäraton (the small room)',
    },
    {
      name: 'Soundboks',
      name_en: 'Soundboks',
    },
  ]).returning('id');

  const bookingIds = await knex<BookingRequest>('booking_requests').insert([
    {
      booker_id: memberIds[0],
      start: new Date('2021-01-13 21:00'),
      end: new Date('2021-01-13 22:00'),
      event: 'Överlämning',
      status: 'ACCEPTED',
    },
    {
      booker_id: memberIds[1],
      start: new Date('2022-01-10 10:00'),
      end: new Date('2022-01-12 22:00'),
      event: 'Framtiden',
      status: 'PENDING',
    },
    {
      booker_id: memberIds[2],
      start: new Date('2022-01-01 00:00'),
      end: new Date('2022-01-01 23:59'),
      event: 'Nyår',
      status: 'PENDING',
    },
  ]).returning('id');

  await knex<BookingBookables>('booking_bookables').insert([
    {
      booking_request_id: bookingIds[0],
      bookable_id: bookableIds[0],
    },
    {
      booking_request_id: bookingIds[0],
      bookable_id: bookableIds[1],
    },
    {
      booking_request_id: bookingIds[1],
      bookable_id: bookableIds[2],
    },
    {
      booking_request_id: bookingIds[2],
      bookable_id: bookableIds[3],
    },
  ]);

  await knex<Door>('doors').insert([
    { name: 'idet' },
    { name: 'koket' },
    { name: 'stad' },
    { name: 'border' },
    { name: 'styrelserummet' },
    { name: 'mauer' },
    { name: 'sex' },
    { name: 'buren' },
    { name: 'ful' },
    { name: 'utskott' },
    { name: 'komitea' },
  ]);

  await knex<DoorAccessPolicy>('door_access_policies').insert([
    { door_name: 'idet', role: 'dsek.infu.dwww' },
    { door_name: 'idet', student_id: 'dat15fno' },
  ]);

  await knex<MailAlias>('email_aliases').insert([
    { position_id: 'dsek.infu.dwww', email: 'dwww@dsek.se' },
    { position_id: 'dsek.infu.dwww', email: 'dwww-medlem@dsek.se' },
    { position_id: 'dsek.infu.dwww.mastare', email: 'dwww@dsek.se' },
    { position_id: 'dsek.infu.dwww.mastare', email: 'dwww-ansvarig@dsek.se' },
  ]);
};
