import { Knex } from 'knex';
import { Markdown } from '~/src/types/news';

export default async function insertMarkdowns(knex: Knex) {
  await knex<Markdown>('markdowns').insert([
    {
      name: 'cafe',
      markdown: 'Hej jag är liten fisk',
      markdown_en: 'Hi I am a little fish',
    },
  ]);
}
