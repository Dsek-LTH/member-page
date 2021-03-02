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

const getArticles = async (page: number, perPage: number) => {
  const articles = await knex<DbArticle>('articles')
    .select('*')
    .offset(page * perPage)
    .limit(perPage);

  const numberOfArticles = (await knex<DbArticle>('articles').count({count: '*'}))[0].count || 0;
  const totalPages = Math.ceil(<number>numberOfArticles / perPage);

  const info = {
    totalPages: totalPages,
    totalItems: numberOfArticles,
    page: page,
    perPage: perPage,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
  };

  return {
    articles: articles,
    pageInfo: info,
  };
}


export {
  DbArticle,
  getAllArticles,
  getArticles,
}