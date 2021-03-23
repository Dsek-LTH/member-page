import { knex } from 'dsek-shared';

interface DbArticle {
  id: number,
  header: string,
  body: string,
  author_id: number,
  published_datetime: string,
  latest_edit_datetime?: string,
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

const createArticle = async (header: string, body: string) => {
  const newArticle = {
    header: header,
    body: body,
    author_id: 1,
    published_datetime: new Date(),
  };
  const id = (await knex('articles').insert(newArticle))[0];
  const result = (await knex<DbArticle>('articles').where({id}))[0];
  return result;
}

const updateArticle = async (id: number, header: string, body: string) => {
  const updatedArticle = {
    header: header,
    body: body,
    latest_edit_datetime: new Date(),
  };
  await knex('articles').where({id}).update(updatedArticle);
  const result = (await knex<DbArticle>('articles').where({id}))[0];
  console.log(result);
  return result;
}

const removeArticle = async (id: number) => {
  const result = await knex('articles').where({id}).del();
  return result;
}


export {
  DbArticle,
  getArticles,
  createArticle,
  updateArticle,
  removeArticle,
}