import { Knex } from 'knex';
import { Door } from '~/src/types/database';

export default async function insertDoors(knex: Knex): Promise<void> {
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
}
