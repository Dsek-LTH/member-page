import { Knex } from 'knex';
import { Comment } from '~/src/types/events';

export default async function insertEventComments(
  knex: Knex,
  eventIds: string[],
  memberIds: string[],
): Promise<void> {
  await knex<Comment>('event_comments').insert([
    {
      member_id: memberIds[0],
      event_id: eventIds[0],
      content: 'Wow! Vad coolt att man kan kommentera på events nu också! [@Edsger Dijkstra](/members/ed1234di-s)',
      published: new Date('2022-11-05'),
    },
    {
      member_id: memberIds[5],
      event_id: eventIds[0],
      content: 'Detta är en cool kommentar på ett event',
      published: new Date('2022-11-04'),
    },
    {
      member_id: memberIds[2],
      event_id: eventIds[0],
      content: 'Muuuuu! [@Edsger Dijkstra](/members/ed1234di-s)',
      published: new Date('2022-11-06'),
    },
  ]);
}
