import { UserInputError, ApolloError } from 'apollo-server';
import { dbUtils, minio } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

type UploadUrl = {
  fileUrl: string,
  presignedUrl: string
}


export default class News extends dbUtils.KnexDataSource {


  private convertArticle(article: sql.DbArticle): gql.Article {
    const {
      author_id,
      published_datetime,
      latest_edit_datetime,
      image_url,
      ...rest
    } = article;

    const a: gql.Article = {
      author: {
        id: article.author_id
      },
      image_url: image_url,
      published_datetime: new Date(published_datetime),
      latest_edit_datetime: latest_edit_datetime ? new Date(latest_edit_datetime) : undefined,
      ...rest,
    }
    return a;
  }

  private async getUploadUrl(fileName: string | undefined): Promise<UploadUrl | undefined> {

    if (!fileName) {
      return undefined;
    }

    const hour = 60 * 60;
    const presignedUrl = await minio.presignedPutObject('news', fileName, hour);
    const fileUrl = presignedUrl.split('?')[0];
    console.log(fileUrl)
    console.log(presignedUrl)
    return {
      fileUrl: fileUrl,
      presignedUrl: presignedUrl
    };
  }

  async getArticle(id: number): Promise<gql.Maybe<gql.Article>> {
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles')
      .select('*')
      .where({ id: id }))
    
    return article ? this.convertArticle(article) : undefined;
  }

  async getArticles(page: number, perPage: number): Promise<gql.ArticlePagination> {
    const articles = await this.knex<sql.DbArticle>('articles')
      .select('*')
      .offset(page * perPage)
      .orderBy("published_datetime", "desc")
      .limit(perPage);

    const numberOfArticles = (await this.knex<sql.DbArticle>('articles').count({ count: '*' }))[0].count || 0;
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

  async createArticle(header: string, body: string, keycloakId: string, headerEn?: string, bodyEn?: string, imageName?: string): Promise<gql.Maybe<gql.CreateArticlePayload>> {
    const user = await dbUtils.unique(this.knex<sql.DbKeycloak>('keycloak').where({ keycloak_id: keycloakId }));
    if (!user) {
      throw new ApolloError('Could not find member based on keycloak id');
    }

    const uploadUrl = await this.getUploadUrl(imageName);

    const newArticle = {
      header: header,
      header_en: headerEn,
      body: body,
      body_en: bodyEn,
      author_id: user.member_id,
      published_datetime: new Date(),
      image_url: uploadUrl?.fileUrl,
    };
    const id = (await this.knex<sql.DbArticle>('articles').insert(newArticle))[0];
    const article = { id, ...newArticle, };
    return {
      article: this.convertArticle(article),
      uploadUrl: uploadUrl?.presignedUrl,
    }
  }

  async updateArticle(id: number, header?: string, body?: string, headerEn?: string, bodyEn?: string, imageName?: string): Promise<gql.Maybe<gql.UpdateArticlePayload>> {

    const uploadUrl = await this.getUploadUrl(imageName);

    const updatedArticle = {
      header: header,
      header_en: headerEn,
      body: body,
      body_en: bodyEn,
      latest_edit_datetime: new Date(),
      image_url: uploadUrl?.fileUrl,
    };
    await this.knex('articles').where({ id }).update(updatedArticle);
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles').where({ id }));
    if (!article) throw new UserInputError('id did not exist');

    return {
      article: this.convertArticle(article),
      uploadUrl: uploadUrl?.presignedUrl,
    }
  }

  async removeArticle(id: number): Promise<gql.Maybe<gql.RemoveArticlePayload>> {
    const article = await dbUtils.unique(this.knex<sql.DbArticle>('articles').where({ id }));
    if (!article) throw new UserInputError('id did not exist');
    await this.knex<sql.DbArticle>('articles').where({ id }).del();
    return {
      article: this.convertArticle(article),
    }
  }

  async uploadImage(fileName: string): Promise<gql.Maybe<string>> {
    const hour = 60 * 60;
    let url: string = await minio.presignedPutObject('news', fileName, hour)
    return url;
  }
}