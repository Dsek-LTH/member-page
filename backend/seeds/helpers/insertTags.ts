import { Knex } from 'knex';
import { Tag } from '~/src/types/news';

export default async function insertTags(knex: Knex): Promise<string[]> {
  return (await knex<Tag>('tags').insert([
    {
      name: 'Gratis mat',
      name_en: 'Free food',
      color: '#00ab28',
    },
    {
      name: 'Företagsevent',
      name_en: 'Company event',
      color: '#18a0c5',
    },
    {
      name: 'Viktigt',
      name_en: 'Important',
      color: '#ff2727d8',
      is_default: true,
    },
    {
      name: 'Stora evenemang',
      name_en: 'Big events',
      color: '#F280A1',
    },
  ]).returning('id')).map((tag) => tag.id);
}
