import { Knex } from 'knex';
import { Member } from '~/src/types/database';

export default async function insertMembers(knex: Knex): Promise<string[]> {
  return (await knex<Member>('members').insert([
    {
      student_id: 'dat15ewi',
      first_name: 'Grace',
      last_name: 'Hopper',
      class_programme: 'D',
      class_year: 2015,
      picture_path: 'https://www.timeforkids.com/wp-content/uploads/2020/08/Grace_003.jpg?w=926',
    }, {
      student_id: 'ad1234lo-s',
      first_name: 'Ada',
      last_name: 'Lovelace',
      class_programme: 'D',
      class_year: 2016,
      picture_path: 'https://historia.nu/wp-content/uploads/2022/04/Ada_Lovelace-1200x800-1.jpg',
    }, {
      student_id: 'no1774ma-s',
      first_name: 'Charles',
      last_name: 'Babbage',
      class_programme: 'D',
      class_year: 2017,
      picture_path: 'https://www.thoughtco.com/thmb/QpVnuZdkg1pTW8vn4PRKUHqubVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/babbge-5b8587cac9e77c0025e6f233.png',
    },
    {
      student_id: 'lu3021bo-s',
      first_name: 'Alan',
      last_name: 'Turing',
      class_programme: 'D',
      class_year: 2020,
      picture_path: 'https://fof-se.eu-central-1.linodeobjects.com/app/uploads/2021/10/alan_turing_photo.jpg',
    },
    {
      student_id: 'jo1234ne-s',
      first_name: 'John',
      last_name: 'von Neumann',
      class_programme: 'D',
      class_year: 2020,
      picture_path: 'https://upload.wikimedia.org/wikipedia/commons/7/78/HD.3F.191_%2811239892036%29.jpg',
    },
    {
      student_id: 'ol1662le-s',
      first_name: 'Ole-Johan',
      last_name: 'Dahl',
      class_programme: 'D',
      class_year: 2021,
      picture_path: 'https://www.ub.uio.no/fag/naturvitenskap-teknologi/informatikk/faglig/dns/bilder/dahlolejohan_cropped.jpeg',
    },
    {
      student_id: 'ed1234di-s',
      first_name: 'Edsger',
      last_name: 'Dijkstra',
      nickname: 'Dijkstra',
      class_programme: 'D',
      class_year: 2020,
      picture_path: 'https://cacm.acm.org/system/assets/0000/3432/072010_CACMpg41_An-Interview.large.jpg?1476779421&1279552189',
    },
  ]).returning('id')).map((v) => v.id);
}
