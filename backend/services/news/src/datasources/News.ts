import { UserInputError, ApolloError } from 'apollo-server';
import { dbUtils, minio, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

type UploadUrl = {
  fileUrl: string,
  presignedUrl: string
}


export default class News extends dbUtils.KnexDataSource {


  private convertArticle(article: sql.Article): gql.Article {
    const {
      author_id,
      published_datetime,
      latest_edit_datetime,
      image_url,
      body_en,
      header_en,
      ...rest
    } = article;

    const a: gql.Article = {
      author: {
        id: article.author_id
      },
      imageUrl: image_url,
      bodyEn: body_en,
      headerEn: header_en,
      publishedDatetime: new Date(published_datetime),
      latestEditDatetime: latest_edit_datetime ? new Date(latest_edit_datetime) : undefined,
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

  getArticle = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Article>> =>
    this.withAccess('news:article:read', context, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles')
        .select('*')
        .where({ id: id }))

      return article ? this.convertArticle(article) : undefined;
    });

  getArticles = (context: context.UserContext, page: number, perPage: number): Promise<gql.ArticlePagination> =>
    this.withAccess('news:article:read', context, async () => {
      const articles = await this.knex<sql.Article>('articles')
        .select('*')
        .offset(page * perPage)
        .orderBy("published_datetime", "desc")
        .limit(perPage);

      const numberOfArticles = (await this.knex<sql.Article>('articles').count({ count: '*' }))[0].count || 0;
      const pageInfo = dbUtils.createPageInfo(<number>numberOfArticles, page, perPage)

      return {
        articles: articles.map(a => this.convertArticle(a)),
        pageInfo: pageInfo,
      };
    });

  createArticle = (context: context.UserContext, articleInput: gql.CreateArticle): Promise<gql.Maybe<gql.CreateArticlePayload>> =>
    this.withAccess('news:article:create', context, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: context.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const uploadUrl = await this.getUploadUrl(articleInput.imageName);

      const newArticle = {
        header: articleInput.header,
        header_en: articleInput.headerEn,
        body: articleInput.body,
        body_en: articleInput.bodyEn,
        author_id: user.member_id,
        published_datetime: new Date(),
        image_url: uploadUrl?.fileUrl,
      };
      const id = (await this.knex<sql.Article>('articles').insert(newArticle).returning('id'))[0];
      const article = { id, ...newArticle, };
      return {
        article: this.convertArticle(article),
        uploadUrl: uploadUrl?.presignedUrl,
      }
    });

  updateArticle = (context: context.UserContext, articleInput: gql.UpdateArticle, id: number): Promise<gql.Maybe<gql.UpdateArticlePayload>> =>
    this.withAccess('news:article:update', context, async () => {

      const uploadUrl = await this.getUploadUrl(articleInput.imageName);

      const updatedArticle = {
        header: articleInput.header,
        header_en: articleInput.headerEn,
        body: articleInput.body,
        body_en: articleInput.bodyEn,
        latest_edit_datetime: new Date(),
        image_url: uploadUrl?.fileUrl,
      };
      await this.knex('articles').where({ id }).update(updatedArticle);
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      return {
        article: this.convertArticle(article),
        uploadUrl: uploadUrl?.presignedUrl,
      }
    });

  removeArticle = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.RemoveArticlePayload>> =>
    this.withAccess('news:article:delete', context, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');
      await this.knex<sql.Article>('articles').where({ id }).del();
      return {
        article: this.convertArticle(article),
      }
    });

  getPresignedPutUrl = (context: context.UserContext, fileName: string): Promise<gql.Maybe<string>> =>
    this.withAccess(['news:article:create', 'news:article:update'], context, async () => {
      const hour = 60 * 60;
      let url: string = await minio.presignedPutObject('news', fileName, hour)
      return url;
    });
}