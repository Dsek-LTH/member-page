import { UserInputError, ApolloError } from 'apollo-server';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import {
  dbUtils, minio, context, UUID, createLogger,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import { Member as sqlMember } from '../types/database';
import { slugify } from '../shared/utils';

const notificationsLogger = createLogger('notifications');

export function convertTag(
  tag: sql.Tag,
): gql.Tag {
  const {
    name_en: nameEn,
    ...rest
  } = tag;
  return {
    nameEn: nameEn ?? tag.name,
    ...rest,
  };
}

export function convertArticle({
  article,
  numberOfLikes,
  isLikedByMe,
  tags = [],
  likers = [],
  comments = [],
}: {
  article: sql.Article,
  numberOfLikes?: number,
  isLikedByMe?: boolean,
  tags?: gql.Tag[],
  likers?: gql.Member[],
  comments?: gql.Comment[],
}) {
  const {
    published_datetime: publishedDate,
    latest_edit_datetime: latestEditDate,
    author_id: authorId,
    author_type: authorType,
    image_url: imageUrl,
    body_en: bodyEn,
    header_en: headerEn,
    ...rest
  } = article;
  let author: gql.Author = {
    __typename: 'Mandate',
    id: authorId,
    start_date: '',
    end_date: '',
  };
  if (authorType === 'Member') {
    author = {
      __typename: 'Member',
      id: authorId,
    };
  }
  const a: gql.Article = {
    ...rest,
    author,
    imageUrl: imageUrl ?? undefined,
    bodyEn: bodyEn ?? undefined,
    headerEn: headerEn ?? undefined,
    publishedDatetime: new Date(publishedDate),
    latestEditDatetime: latestEditDate ? new Date(latestEditDate) : undefined,
    likes: numberOfLikes ?? 0,
    isLikedByMe: isLikedByMe ?? false,
    tags,
    likers,
    comments,
  };
  return a;
}

const convertComment = (comment: sql.Comment, members: sqlMember[]): gql.Comment => ({
  id: comment.id,
  content: comment.content,
  member: members.find((m) => m.id === comment.member_id)!,
  published: comment.published,
});

export default class News extends dbUtils.KnexDataSource {
  getArticle(ctx: context.UserContext, id?: UUID, slug?: string): Promise<gql.Maybe<gql.Article>> {
    return this.withAccess('news:article:read', ctx, async () => {
      if (!slug && !id) return undefined;
      const query = this.knex<sql.Article>('articles');
      if (id) {
        query.where({ id });
      } else if (slug) {
        query.where({ slug });
      }
      const article = await query.first();
      return article
        ? convertArticle(
          { article },
        ) : undefined;
    });
  }

  getArticles(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    tagIds?: string[],
  ): Promise<gql.ArticlePagination> {
    return this.withAccess('news:article:read', ctx, async () => {
      let query = this.knex<sql.Article>('articles');
      if (tagIds?.length) {
        const articleIdsWithTag = (await this.knex<sql.ArticleTag>('article_tags').whereIn('tag_id', tagIds)).map((a) => a.article_id);
        query = query.whereIn('id', articleIdsWithTag);
      }
      query = query.offset(page * perPage)
        .orderBy('published_datetime', 'desc')
        .limit(perPage);

      const articles = await query;

      const numberOfArticles = parseInt((await this.knex<sql.Article>('articles').count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>numberOfArticles, page, perPage);

      return {
        articles: await Promise.all(articles.map(async (article) =>
          convertArticle({ article }))),
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

  async getLikesCount(article_id: UUID): Promise<number> {
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

  async getLikers(article_id: UUID): Promise<gql.Member[]> {
    const likes = await this.knex<sql.Like>('article_likes').where({ article_id });
    const memberIds: string[] = [...new Set(likes.map((l) => l.member_id))];
    const members = await this.knex<sqlMember>('members').whereIn('id', memberIds);
    return members;
  }

  async getComments(article_id: UUID): Promise<gql.Comment[]> {
    const sqlComments = await this.knex<sql.Comment>('article_comments').where({ article_id }).orderBy('published', 'asc');
    const memberIds: string[] = [...new Set(sqlComments.map((c) => c.member_id))];
    const members = await this.knex<sqlMember>('members').whereIn('id', memberIds);
    const comments: gql.Comment[] = sqlComments.map((c) => convertComment(c, members));
    return comments;
  }

  async getComment(id: UUID): Promise<gql.Maybe<gql.Comment>> {
    const sqlComment = await this.knex<sql.Comment>('article_comments').where({ id }).first();
    if (!sqlComment) throw new UserInputError(`Comment with id ${id} does not exist`);
    const members = await this.knex<sqlMember>('members').where({ id: sqlComment?.member_id });
    return convertComment(sqlComment, members);
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

      const uploadUrlPromise = this.getUploadData(ctx, articleInput.imageName, articleInput.header);

      const [author, uploadData] = await Promise.all([authorPromise, uploadUrlPromise]);

      const newArticle = {
        header: articleInput.header,
        header_en: articleInput.headerEn,
        body: articleInput.body,
        body_en: articleInput.bodyEn,
        published_datetime: new Date(),
        image_url: uploadData?.fileUrl,
        slug: await this.slugify('articles', articleInput.header),
        ...author,
      };

      const article = (await this.knex<sql.Article>('articles').insert(newArticle).returning('*'))[0];

      let tags: gql.Tag[] | undefined;
      if (articleInput.tagIds?.length) {
        const addPromise = await this.addTags(ctx, article.id, articleInput.tagIds);
        const getPromise = await this.getTags(article.id);
        [tags] = await Promise.all([getPromise, addPromise]);
      }
      if (articleInput.sendNotification) {
        this.sendNotifications(
          article.header,
          article.body,
          articleInput.tagIds,
          { id: article.id },
        );
      }
      return {
        article: convertArticle({
          article, numberOfLikes: 0, isLikedByMe: false, tags,
        }),
        uploadUrl: uploadData?.uploadUrl,
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
      if (!originalArticle) {
        throw new UserInputError(`Article with id ${id} does not exist`);
      }
      const existingTags = await this.getTags(id);
      const updateTags = async () => {
        if (articleInput.tagIds?.length) {
          const promise1 = this.knex<sql.ArticleTag>('article_tags').where({ article_id: id }).whereNotIn('tag_id', articleInput.tagIds).del();
          const existingPromise = this.knex<sql.ArticleTag>('article_tags').where({ article_id: id }).whereIn('tag_id', articleInput.tagIds);
          const existing = (await Promise.all([existingPromise, promise1]))[0].map((e) => e.tag_id);
          await this.addTags(ctx, id, articleInput.tagIds.filter((t) => !existing.includes(t)));
        } else if (existingTags.length) {
          await this.removeTags(ctx, id, existingTags.map((t) => t.id));
        }
      };
      const updateTagsPromise = updateTags();
      const uploadData = await this.getUploadData(
        ctx,
        articleInput.imageName,
        articleInput.header || originalArticle.header,
      );
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
        image_url: uploadData?.fileUrl,
        ...author,
      };

      await this.knex('articles').where({ id }).update(updatedArticle);
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');
      await updateTagsPromise;

      return {
        article: convertArticle({ article }),
        uploadUrl: uploadData?.uploadUrl,
      };
    }, originalArticle?.author.id);
  }

  async removeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    const article = await this.getArticle(ctx, id);
    return this.withAccess('news:article:delete', ctx, async () => {
      if (!article) throw new UserInputError('id did not exist');
      await this.knex<sql.Article>('articles').where({ id }).del();
      return {
        article,
      };
    }, article?.author.id);
  }

  async removeComment(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticlePayload>> {
    const comment = await this.knex<sql.Comment>('article_comments').where({ id }).first();
    return this.withAccess('news:article:comment:delete', ctx, async () => {
      if (!comment) throw new UserInputError('comment id did not exist');
      const article = await this.getArticle(ctx, comment?.article_id);
      if (!article) throw new UserInputError('Article does not exist?');
      await this.knex<sql.Article>('article_comments').where({ id }).del();
      return { article };
    }, comment?.member_id);
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
        article: convertArticle({
          article,
          numberOfLikes: await this.getLikesCount(id),
          isLikedByMe: true,
        }),
      };
    });
  }

  commentArticle(ctx: context.UserContext, id: UUID, content: string):
  Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:comment', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('Article id does not exist');

      await this.knex<sql.Comment>('article_comments').insert({
        article_id: id,
        member_id: user.member_id,
        content,
        published: new Date(),
      });

      return {
        article: convertArticle({
          article,
          comments: await this.getComments(id),
        }),
      };
    });
  }

  unlikeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
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
          {
            article,
            numberOfLikes: await this.getLikesCount(id),
            isLikedByMe: false,
          },
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
      const ids = (await this.knex<sql.ArticleTag>('article_tags').insert(tagIds.map((tagId) => ({
        article_id: articleId,
        tag_id: tagId,
      }))).returning('id')).map((r) => r.id);
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

  async getUploadData(ctx: context.UserContext, fileName: string | undefined, header: string):
  Promise<gql.Maybe<gql.UploadData>> {
    return this.withAccess(['news:article:create', 'news:article:update'], ctx, async () => {
      if (!fileName) {
        return undefined;
      }

      const hour = 60 * 60;
      const uploadUrl = await minio.presignedPutObject('news', `public/${header && `${slugify(header)}/`}${fileName}`, hour);
      const fileUrl = uploadUrl.split('?')[0];
      return {
        fileUrl,
        uploadUrl,
      };
    });
  }

  private async sendNotifications(title: string, body: string, tagIds?: UUID[], data?: Object) {
    const expo = new Expo();
    let uniqueTokens: string[] = [];

    if (tagIds?.length) {
      const tokens = (await this.knex<sql.Token>('expo_tokens')
        .join('token_tags', 'token_id', 'expo_tokens.id')
        .select('expo_tokens.expo_token')
        .whereIn('tag_id', tagIds))
        .map((t) => t.expo_token);
      uniqueTokens = [...new Set(tokens)];
    } else {
      uniqueTokens = (await this.knex<sql.Token>('expo_tokens').select('expo_token')).map((token) => token.expo_token);
    }

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
            const pushTickets = await expo.sendPushNotificationsAsync(
              chunks[i],
            );
            notificationsLogger.info(JSON.stringify(pushTickets));
          } catch (error) {
            notificationsLogger.error(error);
          }
        }
      }
    }
  }
}
