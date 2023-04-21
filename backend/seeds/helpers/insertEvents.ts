import { Knex } from 'knex';
import { Event } from '~/src/types/events';

export default async function insertEvents(
  knex: Knex,
  memberIds: string[],
): Promise<string[]> {
  return (await knex<Event>('events').insert([
    {
      title: 'DWWW LAN',
      slug: 'dwww-lan',
      title_en: 'very english title',
      description: 'Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 Beskrivning av event 1 ',
      description_en: 'very english description',
      location: 'iDét',
      organizer: 'DWWW',
      author_id: memberIds[5],
      short_description: 'Beskrivning av event 1',
      short_description_en: 'Description of event 1',
      link: 'https://dsek.se',
      start_datetime: '2022-11-14 07:00:00',
      end_datetime: '2022-11-14 10:00:00',
    },
    {
      title: 'Event 2',
      description: 'Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 Beskrivning av event 2 ',
      short_description: 'Beskrivning av event 2',
      start_datetime: '2021-03-29 10:30:01',
      end_datetime: '2021-04-15 19:30:00',
      link: 'https://google.se',
      author_id: memberIds[3],
      organizer: 'Grace',
    },
    {
      title: 'Event 1',
      description: 'event 1 är banger',
      short_description: 'kort banger',
      removed_at: new Date('1993-11-23'),
      start_datetime: '2021-03-29 10:30:01',
      end_datetime: '2021-04-15 19:30:00',
      link: 'https://google.se',
      author_id: memberIds[3],
      organizer: 'Grace',
    },
  ]).returning('id')).map(((row) => row.id));
}
