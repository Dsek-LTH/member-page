import { Knex } from 'knex';
import { Comment, Like } from '~/src/types/news';

export default async function insertArticleCommentsAndLikes(
  knex: Knex,
  articleIds: string[],
  memberIds: string[],
): Promise<void> {
  await knex<Comment>('article_comments').insert([
    {
      member_id: memberIds[0],
      article_id: articleIds[3],
      content: 'Wow! Vad coolt att man kan kommentera nu! [@Ole-Johan Dahl](/members/ol1234da-s)',
      published: new Date('2022-11-05'),
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[3],
      content: 'Detta är en cool kommentar',
      published: new Date('2022-11-04'),
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[3],
      content: 'Visst är det? [@Edsger Dijkstra](/members/ed1234di-s)',
      published: new Date('2022-11-06'),
    },
  ]);

  await knex<Like>('article_likes').insert([
    {
      member_id: memberIds[0],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[1],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[3],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[6],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[3],
    },
    {
      member_id: memberIds[0],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[1],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[2],
    },
    {
      member_id: memberIds[2],
      article_id: articleIds[1],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[1],
    },
    {
      member_id: memberIds[5],
      article_id: articleIds[0],
    },
  ]);
}
