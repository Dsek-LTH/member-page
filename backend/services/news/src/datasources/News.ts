import { UserInputError, ApolloError } from 'apollo-server';
import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class News extends dbUtils.KnexDataSource {

  private convertArticle(article: sql.DbArticle | undefined): gql.Article | undefined {
    if (article) {
      const {
        author_id,
        published_datetime,
        latest_edit_datetime,
        ...rest
      } = article;

      const a: gql.Article = {
        author: {
          id: article.author_id
        },
        published_datetime: new Date(published_datetime),
        ...rest,
      }
      if (latest_edit_datetime)
        a.latest_edit_datetime = new Date(latest_edit_datetime);
      return a;
    } else {
      return undefined;
    }
  }

  async getArticle(id: number): Promise<gql.Maybe<gql.Article>> {
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles')
      .select('*')
      .where({id: id}))
    return this.convertArticle(article);
  }

  async getArticles(page: number, perPage: number): Promise<gql.ArticlePagination> {
    const articles = await this.knex<sql.DbArticle>('articles')
      .select('*')
      .offset(page * perPage)
      .limit(perPage);

    const numberOfArticles = (await this.knex<sql.DbArticle>('articles').count({count: '*'}))[0].count || 0;
    const totalPages = Math.ceil(<number>numberOfArticles / perPage);

    const info = {
      totalPages: totalPages,
      totalItems: <number>numberOfArticles,
      page: page,
      perPage: perPage,
      hasNextPage: page < totalPages - 1,
      hasPreviousPage: page > 0,
    };

    return {
      articles: articles.map(a => this.convertArticle(a)),
      pageInfo: info,
    };
  }

  async createArticle(header: string, body: string, keycloakId: string): Promise<gql.Maybe<gql.Article>> {
    const user = await dbUtils.unique(this.knex<sql.DbKeycloak>('keycloak').where({keycloak_id: keycloakId}));
    if (!user)
      throw new ApolloError('Could not find member based on keycloak id');
    const newArticle = {
      header: header,
      body: body,
      author_id: user.member_id,
      published_datetime: new Date().toISOString(),
    };
    const id = (await this.knex<sql.DbArticle>('articles').insert(newArticle))[0];
    const article = { id, ...newArticle, };
    return this.convertArticle(article);
  }

  async updateArticle(id: number, header?: string, body?: string): Promise<gql.Maybe<gql.Article>> {
    const updatedArticle = {
      header: header,
      body: body,
      latest_edit_datetime: new Date(),
    };
    await this.knex('articles').where({id}).update(updatedArticle);
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles').where({id}));
    if (!article) throw new UserInputError('id did not exist');
    return this.convertArticle(article);
  }

  async removeArticle(id: number): Promise<gql.Maybe<gql.Article>> {
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles').where({id}));
    if (!article) throw new UserInputError('id did not exist');
    await this.knex<sql.DbArticle>('articles').where({id}).del();
    return this.convertArticle(article);
  }
}