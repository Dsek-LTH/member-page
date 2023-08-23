import { Knex } from 'knex';
import { Author } from '~/src/types/author';

const authors = (memberIds: string[], mandateIds: string[], customAuthorIds: string[]):
(Omit<Author, 'id' | 'created_at' | 'updated_at'>)[] => [
  {
    member_id: memberIds[0],
    type: 'Member',
  },
  {
    member_id: memberIds[0],
    type: 'Member',
  },
  {
    member_id: memberIds[1],
    type: 'Member',
  },
  {
    member_id: memberIds[2],
    type: 'Member',
  },
  {
    member_id: memberIds[3],
    type: 'Member',
  },
  {
    member_id: memberIds[4],
    type: 'Member',
  },
  {
    member_id: memberIds[5],
    type: 'Member',
  },
  {
    member_id: memberIds[0],
    mandate_id: mandateIds[0],
    type: 'Mandate',
  },
  {
    member_id: memberIds[3],
    mandate_id: mandateIds[1],
    type: 'Mandate',
  },
  {
    member_id: memberIds[0],
    mandate_id: mandateIds[2],
    type: 'Mandate',
  },
  {
    member_id: memberIds[0],
    mandate_id: mandateIds[3],
    type: 'Mandate',
  },
  {
    member_id: memberIds[0],
    mandate_id: mandateIds[4],
    type: 'Mandate',
  },
  {
    member_id: memberIds[0],
    mandate_id: mandateIds[5],
    type: 'Mandate',
  },
  {
    member_id: memberIds[6], // överphös
    custom_id: customAuthorIds[0], // staben
    type: 'Custom',
  },
  {
    member_id: memberIds[6], // överphös
    custom_id: customAuthorIds[1], // styrelsen
    type: 'Custom',
  },
];

export default async function insertArticles(
  knex: Knex,
  memberIds: string[],
  mandateIds: string[],
  customAuthorIds: string[],
): Promise<string[]> {
  return (await knex<Author>('authors').insert(
    authors(memberIds, mandateIds, customAuthorIds),
  ).returning('id')).map((v) => v.id);
}
