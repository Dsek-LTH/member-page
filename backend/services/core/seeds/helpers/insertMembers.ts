import { Knex } from 'knex';
import { Member } from '~/src/types/database';

export default async function insertMembers(knex: Knex): Promise<string[]> {
  return (await knex<Member>('members').insert([
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
  ]).returning('id')).map((v) => v.id);
}
