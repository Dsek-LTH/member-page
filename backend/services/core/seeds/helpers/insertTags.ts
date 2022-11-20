import { Knex } from 'knex';
import { Tag } from '~/src/types/news';

export default async function insertTags(knex: Knex) {
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
}
