import { UserInputError, ApolloError } from 'apollo-server';
import {
  dbUtils, minio, context, UUID,
} from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

type UploadUrl = {
  fileUrl: string,
  presignedUrl: string
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
  async convertArticle(article: sql.Article, keycloakId: string | undefined): Promise<gql.Article> {
    const {
      published_datetime,
      latest_edit_datetime,
      image_url,
      body_en,
      header_en,
      author_id,
      id,
      ...rest
    } = article;

    const [likesCount] = await this.knex('article_likes')
      .where('article_id', id)
      .count('article_id', { as: 'likesCount' })
      .select('article_id')
      .groupBy('article_id');

    let isLiked = false;
    if (keycloakId) {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: keycloakId }));
      const liked = await dbUtils.unique(this.knex<sql.Like>('article_likes')
        .where({ article_id: id, member_id: user?.member_id }));
      if (liked) isLiked = true;
    }

    const a: gql.Article = {
      ...rest,
      id,
      author: {
        id: author_id,
      },
      isLiked,
      likes: likesCount ? likesCount.likesCount as number : 0,
      imageUrl: image_url ?? undefined,
      bodyEn: body_en ?? undefined,
      headerEn: header_en ?? undefined,
      publishedDatetime: new Date(published_datetime),
      latestEditDatetime: latest_edit_datetime ? new Date(latest_edit_datetime) : undefined,
    };
    return a;
  }

  getArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Article>> {
    return this.withAccess('news:article:read', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles')
        .select('*')
        .where({ id }));

      return article ? this.convertArticle(article, ctx.user?.keycloak_id) : undefined;
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
        articles: await Promise.all(
          articles.map(async (a) => this.convertArticle(a, ctx.user?.keycloak_id)),
        ),
        pageInfo,
      };
    });
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

      const uploadUrl = await getUploadUrl(articleInput.imageName);

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
      const article = { id, ...newArticle };
      return {
        article: await this.convertArticle(article, ctx.user?.keycloak_id),
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
        article: await this.convertArticle(article, ctx.user?.keycloak_id),
        uploadUrl: uploadUrl?.presignedUrl,
      };
    });
  }

  removeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:delete', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');
      await this.knex<sql.Article>('articles').where({ id }).del();
      return {
        article: await this.convertArticle(article, ctx.user?.keycloak_id),
      };
    });
  }

  toggleLikeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:like', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      const data = {
        article_id: id,
        member_id: user.member_id,
      };

      const [alreadyLiked] = await this.knex<sql.Like>('article_likes').where(data);

      if (alreadyLiked) {
        await this.knex<sql.Like>('article_likes').where(data).del();
      } else {
        await this.knex<sql.Like>('article_likes').insert(data);
      }
      return {
        article: await this.convertArticle(article, ctx.user?.keycloak_id),
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
