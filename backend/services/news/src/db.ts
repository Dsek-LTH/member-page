import { knex, dbUtils } from 'dsek-shared';
import { UserInputError } from 'apollo-server';

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

const createArticle = async (header: string, body: string, keycloak_id: string) => {
  const {member_id} = (await knex<{keycloak_id: string, member_id: number}>('keycloak').where({keycloak_id}))[0]; 
  const newArticle = {
    header: header,
    body: body,
    author_id: member_id,
    published_datetime: new Date(),
  };
  const id = (await knex('articles').insert(newArticle))[0];
  const article = { id, ...newArticle, };
  return article;
}

const updateArticle = async (id: number, header: string, body: string) => {
  const updatedArticle = {
    header: header,
    body: body,
    latest_edit_datetime: new Date(),
  };
  await knex('articles').where({id}).update(updatedArticle);
  const article = await dbUtils.unique(knex('articles').where({id}));
  if (!article) throw new UserInputError('id did not exist');
  return article;
}

const removeArticle = async (id: number) => {
  const article = await dbUtils.unique(knex('articles').where({id}));
  if (!article) throw new UserInputError('id did not exist');
  await knex('articles').where({id}).del();
  return article;
}

const getArticle = async (id: number) => {
  const article = await dbUtils.unique(knex<DbArticle>('articles').where({id}))
  if (!article) throw new UserInputError('id did not exist');
  return article;
}

export {
  DbArticle,
  getArticles,
  createArticle,
  updateArticle,
  removeArticle,
  getArticle,
}