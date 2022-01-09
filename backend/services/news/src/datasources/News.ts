import { UserInputError, ApolloError, AuthenticationError } from 'apollo-server';
import {
  dbUtils, minio, context, UUID,
} from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

type UploadUrl = {
  fileUrl: string,
  presignedUrl: string
}

function chooseTranslation(isEnligh: boolean, sv: string, en?: string | null): string {
  return (isEnligh ? en : sv) ?? sv;
}

export function convertArticle(article: sql.Article, isEnligh: boolean): gql.Article {
  const {
    published_datetime,
    latest_edit_datetime,
    image_url,
    body, body_en,
    header, header_en,
    author_id,
    author_type,
    ...rest
  } = article;

  const a: gql.Article = {
    ...rest,
    author: {
      __typename: author_type,
      id: author_id,
    },
    imageUrl: image_url ?? undefined,
    body: chooseTranslation(isEnligh, body, body_en),
    header: chooseTranslation(isEnligh, header, header_en),
    publishedDatetime: new Date(published_datetime),
    latestEditDatetime: latest_edit_datetime ? new Date(latest_edit_datetime) : undefined,
  };
  return a;
}

export async function getUploadUrl(fileName: string | undefined): Promise<UploadUrl | undefined> {
  if (!fileName) {
    return undefined;
  }

  const hour = 60 * 60;
  const presignedUrl = await minio.presignedPutObject('news', fileName, hour);
  const fileUrl = presignedUrl.split('?')[0];
  return {
    fileUrl,
    presignedUrl,
  };
}

export default class News extends dbUtils.KnexDataSource {
  getArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Article>> {
    return this.withAccess('news:article:read', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles')
        .select('*')
        .where({ id }));

      return article ? convertArticle(article, this.isEnglish()) : undefined;
    });
  }

  getArticles(
    ctx: context.UserContext,
    page: number,
    perPage: number,
  ): Promise<gql.ArticlePagination> {
    return this.withAccess('news:article:read', ctx, async () => {
      const articles = await this.knex<sql.Article>('articles')
        .select('*')
        .offset(page * perPage)
        .orderBy('published_datetime', 'desc')
        .limit(perPage);

      const numberOfArticles = parseInt((await this.knex<sql.Article>('articles').count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>numberOfArticles, page, perPage);

      return {
        articles: articles.map((a) => convertArticle(a, this.isEnglish())),
        pageInfo,
      };
    });
  }

  private async resolveAuthor(user?: sql.Keycloak, mandateId?: UUID): Promise<Pick<sql.Article, 'author_id' | 'author_type'> | undefined> {
    if (!user) return undefined;
    if (mandateId) {
      const mandate = await this.knex<any>('mandates').where({ id: mandateId }).first();
      if (!mandate) {
        throw new UserInputError(`mandate with id ${mandateId} does not exist`);
      }
      if (mandate?.member_id !== user.member_id) {
        throw new AuthenticationError('The mandate does not belong to the user');
      }
      return {
        author_id: mandate.id,
        author_type: 'Mandate',
      };
    }
    return {
      author_id: user.member_id,
      author_type: 'Member',
    };
  }

  createArticle(
    ctx: context.UserContext,
    articleInput: gql.CreateArticle,
  ): Promise<gql.Maybe<gql.CreateArticlePayload>> {
    return this.withAccess('news:article:create', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const author = await this.resolveAuthor(user, articleInput.mandateId);

      const uploadUrl = await getUploadUrl(articleInput.imageName);

      const newArticle = {
        header: articleInput.header,
        header_en: articleInput.headerEn,
        body: articleInput.body,
        body_en: articleInput.bodyEn,
        published_datetime: new Date(),
        image_url: uploadUrl?.fileUrl,
        ...author,
      };

      const article = (await this.knex<sql.Article>('articles').insert(newArticle).returning('*'))[0];
      return {
        article: convertArticle(article, this.isEnglish()),
        uploadUrl: uploadUrl?.presignedUrl,
      };
    });
  }

  updateArticle(
    ctx: context.UserContext,
    articleInput: gql.UpdateArticle,
    id: UUID,
  ): Promise<gql.Maybe<gql.UpdateArticlePayload>> {
    return this.withAccess('news:article:update', ctx, async () => {
      const uploadUrl = await getUploadUrl(articleInput.imageName);

      let author: Pick<sql.Article, 'author_id' | 'author_type'> | undefined;

      if (articleInput.mandateId) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));
        author = await this.resolveAuthor(user, articleInput.mandateId);
      } else {
        author = undefined;
      }

      const updatedArticle = {
        header: articleInput.header,
        header_en: articleInput.headerEn,
        body: articleInput.body,
        body_en: articleInput.bodyEn,
        latest_edit_datetime: new Date(),
        image_url: uploadUrl?.fileUrl,
        ...author,
      };

      await this.knex('articles').where({ id }).update(updatedArticle);
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      return {
        article: convertArticle(article, this.isEnglish()),
        uploadUrl: uploadUrl?.presignedUrl,
      };
    });
  }

  removeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.RemoveArticlePayload>> {
    return this.withAccess('news:article:delete', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');
      await this.knex<sql.Article>('articles').where({ id }).del();
      return {
        article: convertArticle(article, this.isEnglish()),
      };
    });
  }

  getPresignedPutUrl(ctx: context.UserContext, fileName: string): Promise<gql.Maybe<string>> {
    return this.withAccess(['news:article:create', 'news:article:update'], ctx, async () => {
      const hour = 60 * 60;
      const url: string = await minio.presignedPutObject('news', fileName, hour);
      return url;
    });
  }
}
