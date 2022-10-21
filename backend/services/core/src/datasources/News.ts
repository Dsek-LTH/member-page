import { UserInputError, ApolloError } from 'apollo-server';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import {
  dbUtils, minio, context, UUID, createLogger,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

type UploadUrl = {
  fileUrl: string,
  presignedUrl: string
}

const notificationsLogger = createLogger('notifications');

export function convertTag(
  tag: sql.Tag,
): gql.Tag {
  const {
    name_en,
    ...rest
  } = tag;
  return {
    nameEn: name_en ?? tag.name,
    ...rest,
  };
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

export function convertArticle(
  article: sql.Article,
  numberOfLikes?: number,
  isLikedByMe?: boolean,
  tags?: gql.Tag[],
) {
  const {
    published_datetime,
    latest_edit_datetime,
    author_id,
    author_type,
    image_url,
    body_en,
    header_en,
    ...rest
  } = article;
  // Ingen aning hur detta ska fixas
  let author: gql.Author = {
    __typename: 'Mandate',
    id: author_id,
    start_date: '',
    end_date: '',
  };
  if (author_type === 'Member') {
    author = {
      __typename: 'Member',
      id: author_id,
    };
  }
  const a: gql.Article = {
    ...rest,
    author,
    imageUrl: image_url ?? undefined,
    bodyEn: body_en ?? undefined,
    headerEn: header_en ?? undefined,
    publishedDatetime: new Date(published_datetime),
    latestEditDatetime: latest_edit_datetime ? new Date(latest_edit_datetime) : undefined,
    likes: numberOfLikes ?? 0,
    isLikedByMe: isLikedByMe ?? false,
    tags: tags ?? [],
  };
  return a;
}

export default class News extends dbUtils.KnexDataSource {
  private async isLikedByCurrentUser(
    articleId: UUID,
    keycloakId: string,
  ): Promise<boolean> {
    if (!keycloakId) return false;
    return Object.fromEntries((await this.knex<sql.Like>('article_likes')
      .select('article_id')
      .join('keycloak', 'keycloak.member_id', '=', 'article_likes.member_id')
      .where({ keycloak_id: keycloakId })
      .whereIn('article_id', [articleId]))
      .map((r) => [r.article_id, true]))[articleId] ?? false;
  }

  getArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Article>> {
    return this.withAccess('news:article:read', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles')
        .select('*')
        .where({ id }));
      return article
        ? convertArticle(
          article,
        ) : undefined;
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
        articles: await Promise.all(articles.map(async (a) =>
          convertArticle(a))),
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

  async getLikes(article_id: UUID): Promise<number> {
    return (
      Object.fromEntries(
        (
          await this.knex<sql.Like>('article_likes')
            .select('article_id')
            .count({ count: '*' })
            .where({ article_id })
            .groupBy('article_id')
        ).map((r) => [r.article_id, Number(r.count)]),
      )[article_id] ?? 0
    );
  }

  async isLikedByUser(article_id: UUID, keycloak_id?: string): Promise<boolean> {
    if (!keycloak_id) return false;
    return (
      Object.fromEntries(
        (
          await this.knex<sql.Like>('article_likes')
            .select('article_id')
            .join(
              'keycloak',
              'keycloak.member_id',
              '=',
              'article_likes.member_id',
            )
            .where({ keycloak_id })
            .where({ article_id })
        ).map((r) => [r.article_id, true]),
      )[article_id] ?? false
    );
  }

  async getTags(article_id: UUID): Promise<gql.Tag[]> {
    const tagIds: sql.ArticleTag['tag_id'][] = (await this.knex<sql.ArticleTag>('article_tags').select('tag_id').where({ article_id })).map((t) => t.tag_id);
    const tags: sql.Tag[] = await this.knex<sql.Tag>('tags').whereIn('id', tagIds);
    return tags.map(convertTag);
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

      const authorPromise = this.resolveAuthor(user, articleInput.mandateId);

      const uploadUrlPromise = getUploadUrl(articleInput.imageName);

      const [author, uploadUrl] = await Promise.all([authorPromise, uploadUrlPromise]);

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

      let tags: gql.Tag[] | undefined;
      if (articleInput.tagIds) {
        const addPromise = this.addTags(ctx, article.id, articleInput.tagIds);
        const getPromise = this.getTags(article.id);
        [tags] = await Promise.all([getPromise, addPromise]);

        if (articleInput.sendNotification) {
          this.sendNotifications(
            articleInput.tagIds,
            article.header,
            article.body,
            { id: article.id },
          );
        }
      }

      return {
        article: convertArticle(article, 0, false, tags),
        uploadUrl: uploadUrl?.presignedUrl,
      };
    });
  }

  async updateArticle(
    ctx: context.UserContext,
    articleInput: gql.UpdateArticle,
    id: UUID,
  ): Promise<gql.Maybe<gql.UpdateArticlePayload>> {
    const originalArticle = await this.getArticle(ctx, id);
    return this.withAccess('news:article:update', ctx, async () => {
      const updateTags = async () => {
        if (articleInput.tagIds) {
          const promise1 = this.knex<sql.ArticleTag>('article_tags').where({ article_id: id }).whereNotIn('tag_id', articleInput.tagIds).del();
          const existingPromise = this.knex<sql.ArticleTag>('article_tags').where({ article_id: id }).whereIn('tag_id', articleInput.tagIds);
          const existing = (await Promise.all([existingPromise, promise1]))[0].map((e) => e.tag_id);
          await this.addTags(ctx, id, articleInput.tagIds.filter((t) => !existing.includes(t)));
        }
      };
      const updateTagsPromise = updateTags();
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
      await updateTagsPromise;

      return {
        article: convertArticle(
          article,
        ),
        uploadUrl: uploadUrl?.presignedUrl,
      };
    }, originalArticle?.author.id);
  }

  async removeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    const originalArticle = await this.getArticle(ctx, id);
    return this.withAccess('news:article:delete', ctx, async () => {
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');
      await this.knex<sql.Article>('articles').where({ id }).del();
      return {
        article: convertArticle(
          article,
        ),
      };
    }, originalArticle?.author.id);
  }

  likeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:like', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      try {
        await this.knex<sql.Like>('article_likes').insert({
          article_id: id,
          member_id: user.member_id,
        });
      } catch {
        throw new ApolloError('User already liked this article');
      }

      return {
        article: convertArticle(
          article,
          await this.getLikes(id),
          true,
        ),
      };
    });
  }

  dislikeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:like', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      const res = await this.knex<sql.Like>('article_likes').where({
        article_id: id,
        member_id: user.member_id,
      }).del();

      if (!res) throw new ApolloError('User already disliked this article');

      return {
        article: convertArticle(
          article,
          await this.getLikes(id),
          false,
        ),
      };
    });
  }

  addTags(
    ctx: context.UserContext,
    articleId: UUID,
    tagIds: UUID[],
  ): Promise<UUID[]> {
    return this.withAccess('news:article:update', ctx, async () => {
      const ids = await this.knex<sql.ArticleTag>('article_tags').insert(tagIds.map((tagId) => ({
        article_id: articleId,
        tag_id: tagId,
      }))).returning('id');
      return ids;
    });
  }

  removeTags(
    ctx: context.UserContext,
    articleId: UUID,
    tagIds: UUID[],
  ): Promise<number> {
    return this.withAccess('news:article:update', ctx, async () => {
      const deletedRowAmount = await this.knex<sql.ArticleTag>('article_tags').where({
        article_id: articleId,
      }).whereIn('tag_id', tagIds).del();
      return deletedRowAmount;
    });
  }

  getPresignedPutUrl(ctx: context.UserContext, fileName: string): Promise<gql.Maybe<string>> {
    return this.withAccess(['news:article:create', 'news:article:update'], ctx, async () => {
      const hour = 60 * 60;
      const url: string = await minio.presignedPutObject('news', fileName, hour);
      return url;
    });
  }

  private async sendNotifications(tagIds: UUID[], title: string, body: string, data?: Object) {
    const expo = new Expo();

    const testTokens = (await this.knex<sql.Token>('expo_tokens')
      .join('token_tags', 'token_id', 'expo_tokens.id')
      .select('expo_tokens.expo_token')
      .whereIn('tag_id', tagIds))
      .map((t) => t.expo_token);
    const uniqueTokens = [...new Set(testTokens)];

    if (uniqueTokens) {
      const messages: ExpoPushMessage[] = [];
      uniqueTokens.forEach((token) => {
        if (!Expo.isExpoPushToken(token)) {
          notificationsLogger.error(
            `Push token ${token} is not a valid Expo push token`,
          );
        } else {
          const notificationTitle = title.substring(0, 178);
          let notificationBody = '';
          if (body) {
            notificationBody = body?.substring(0, 178 - notificationTitle.length);
          }
          const message: ExpoPushMessage = {
            to: token,
            title: notificationTitle,
            body: notificationBody,
            data,
          };
          messages.push(message);
        }
      });
      if (messages.length > 0) {
        const chunks = expo.chunkPushNotifications(messages);
        for (let i = 0; i < chunks.length; i += 1) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await expo.sendPushNotificationsAsync(
              chunks[i],
            );
          } catch (error) {
            notificationsLogger.error(error);
          }
        }
      }
    }
  }
}
