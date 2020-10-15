import knex from '../../database';

interface IDbArticle {
  article_id: number,
  header: string,
  body: string,
  author_stil_id: string,
  published_datetime: string,
  latest_edit_datetime?: string,
}


const getAllArticles = (): Promise<IDbArticle[]> => {
  return knex<IDbArticle>('articles').select('*')
    .catch((reason: any) => <IDbArticle[]>[])
}


export {
  IDbArticle,
  getAllArticles,
}