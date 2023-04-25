import { Knex } from 'knex';
import { Bookable } from '~/src/types/booking';

export default async function insertBookables(knex: Knex, bookableCategoryIds: string[]) {
  return (await knex<Bookable>('bookables').insert([
    {
      name: 'Uppehållsdelen av iDét',
      name_en: 'Commonroom part of iDét',
      category_id: bookableCategoryIds[0],
      door: 'idet',
    },
    {
      name: 'Köket',
      name_en: 'The Kitchen',
      category_id: bookableCategoryIds[0],
      door: 'koket',
    },
    {
      name: 'Styrelserummet',
      name_en: 'The boardroom',
      category_id: bookableCategoryIds[0],
      door: 'styrelserummet',
    },
    {
      name: 'Shäraton (det lilla rummet)',
      name_en: 'Shäraton (the small room)',
      category_id: bookableCategoryIds[0],
    },
    {
      name: 'Soundboks',
      name_en: 'Soundboks',
      category_id: bookableCategoryIds[1],
    },
  ]).returning('id')).map((v) => v.id);
}
