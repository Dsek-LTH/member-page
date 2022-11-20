import { Knex } from 'knex';
import { BookableCategory } from '~/src/types/booking';

export default async function insertBookableCategories(knex: Knex) {
  return (await knex<BookableCategory>('bookable_categories').insert([
    {
      name: 'Plats',
      name_en: 'Place',
    },
    {
      name: 'Föremål',
      name_en: 'Object',

    },
  ]).returning('id')).map((v) => v.id);
}
