import { Knex } from 'knex';
import { CustomAuthor } from '~/src/types/author';
import { Article } from '~/src/types/news';

const customAuthors: Omit<CustomAuthor, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Staben',
  },
  {
    name: 'Styrelsen',
    name_en: 'The Board',
    image_url: 'https://minio.api.dsek.se/news/public/ecb614a2-c7af-42d5-b631-a56772194dc5.png',
  },
];
type CustomAuthorRoleRelation = {
  custom_author_id: string,
  role: string,
};
const customAuthorRoles = (customAuthorIds: string[]): CustomAuthorRoleRelation[] =>
  [{
    custom_author_id: customAuthorIds[0],
    role: 'dsek.stab',
  }, {
    custom_author_id: customAuthorIds[0],
    role: 'dsek.infu.dwww', // just to test 2 different role assignments
  }, {
    custom_author_id: customAuthorIds[1],
    role: 'dsek.styr',
  }];

export default async function insertCustomAuthors(
  knex: Knex,
): Promise<string[]> {
  const customAuthorIds = (await knex<Article>('custom_authors').insert(
    [...customAuthors],
  ).returning('id')).map((row) => row.id);
  await knex('custom_author_roles').insert(customAuthorRoles(customAuthorIds));
  return customAuthorIds;
}
