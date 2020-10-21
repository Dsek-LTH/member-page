import knex from '../../database';

interface DbArticle {
  article_id: number,
  header: string,
  body: string,
  author_stil_id: string,
  published_datetime: string,
  latest_edit_datetime?: string,
}


const getAllArticles = (): Promise<DbArticle[]> => {
  return knex<DbArticle>('articles').select('*')
    .catch((reason: any) => <DbArticle[]>[])
}


export {
  DbArticle,
  getAllArticles,
}