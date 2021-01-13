import { knex } from 'dsek-shared';

interface DbArticle {
  id: number,
  header: string,
  body: string,
  author_id: number,
  published_datetime: string,
  latest_edit_datetime?: string,
}


const getAllArticles = (): Promise<DbArticle[]> => {
  return knex<DbArticle>('articles').select('*')
    .catch((reason: any) => [])
}


export {
  DbArticle,
  getAllArticles,
}