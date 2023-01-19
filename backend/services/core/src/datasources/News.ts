import { ApolloError, UserInputError } from 'apollo-server';
import type { DataSources } from '../datasources';
import
{
  context, createLogger, dbUtils, minio, UUID,
} from '../shared';
import meilisearchAdmin from '../shared/meilisearch';
import { slugify } from '../shared/utils';
import { Mandate, Member, Member as sqlMember } from '../types/database';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import { TagSubscription } from '../types/notifications';

type AuthorArticle = Omit<gql.Article, 'author'> & {
  author: gql.Mandate | gql.Member;
};
const notificationsLogger = createLogger('notifications');

export async function getAuthor(
  article: AuthorArticle,
  dataSources: DataSources,
  { user, roles }: context.UserContext,
): Promise<gql.Author> {
  if (article.author.__typename === 'Member') {
    const member: gql.Member = {
      ...await dataSources
        .memberAPI.getMember({ user, roles }, { id: article.author.id }),
      __typename: 'Member',
      id: article.author.id,
    };
    return member;
  }
  const mandate: gql.Mandate = {
    start_date: '',
    end_date: '',
    ...await dataSources
      .mandateAPI.getMandate({ user, roles }, article.author.id),
    __typename: 'Mandate',
    id: article.author.id,
  };
  return mandate;
}

export async function getAuthorMemberID(
  article: AuthorArticle,
  dataSources: DataSources,
  { user, roles }: context.UserContext,
) {
  const author = await getAuthor(article, dataSources, { user, roles });
  if (author.__typename === 'Member') {
    return author.id;
  }
  if (author.__typename === 'Mandate') {
    return author.member?.id;
  }
  throw new Error('Author is neither a member nor a mandate');
}

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
  article: sql.ArticleWithTag,
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
    id: article.article_id ?? article.id,
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
      const query = this.knex<sql.Article>('articles').whereNull('removed_at');
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
      let query = this.knex<sql.ArticleWithTag>('articles')
        .whereNull('removed_at');
      if (tagIds?.length) {
        query = query.join('article_tags', 'article_tags.article_id', 'articles.id')
          .whereIn('article_tags.tag_id', tagIds);
      }

      const result = await query
        .select('articles.*')
        .distinct('articles.id', 'published_datetime')
        .orderBy('published_datetime', 'desc')
        .paginate({ perPage, currentPage: page, isLengthAware: true });
      return {
        articles: result.data.map((article) => convertArticle({ article })),
        pageInfo: dbUtils.createPageInfoFromPagination(result.pagination),
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
    const tags: sql.Tag[] = await this.knex<sql.Tag>('tags').whereIn('id', tagIds).orderBy('name', 'asc');
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
        const notificationBody = articleInput.notificationBody || articleInput.notificationBodyEn;

        this.sendNewArticleNotification(
          article,
          article.header,
          (notificationBody?.length ?? 0) > 0 ? notificationBody : undefined,
          articleInput.tagIds,
        );
      }
      meilisearchAdmin.addArticleToSearchIndex(article);
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
    dataSources?: DataSources,
  ): Promise<gql.Maybe<gql.UpdateArticlePayload>> {
    const originalArticle = await this.getArticle(ctx, id);
    if (!originalArticle) throw new UserInputError(`Article with id ${id} does not exist`);
    let memberID;
    if (dataSources) {
      memberID = await getAuthorMemberID(originalArticle, dataSources, ctx);
    }
    return this.withAccess('news:article:update', ctx, async () => {
      if (!originalArticle) {
        throw new UserInputError(`Article with id ${id} does not exist`);
      }

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

      await this.removeAllTagsFromArticle(ctx, id);
      if (articleInput.tagIds?.length) await this.addTags(ctx, id, articleInput.tagIds);

      return {
        article: convertArticle({ article }),
        uploadUrl: uploadData?.uploadUrl,
      };
    }, memberID);
  }

  async removeArticle(
    ctx: context.UserContext,
    id: UUID,
    dataSources?: DataSources,
  ): Promise<gql.Maybe<gql.ArticlePayload>> {
    const article = await this.getArticle(ctx, id);
    if (!article) throw new UserInputError(`Article with id ${id} does not exist`);
    let memberID;
    if (dataSources) {
      memberID = await getAuthorMemberID(article, dataSources, ctx);
    }
    return this.withAccess('news:article:delete', ctx, async () => {
      await this.knex<sql.Article>('articles').where({ id }).update({ removed_at: new Date() });
      return {
        article,
      };
    }, memberID);
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
      if (!ctx.user) throw new Error('User not logged in');
      const me = await this.getMemberFromKeycloakId(ctx.user?.keycloak_id);
      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('id did not exist');

      try {
        await this.knex<sql.Like>('article_likes').insert({
          article_id: id,
          member_id: me.id,
        });
      } catch {
        throw new ApolloError('User already liked this article');
      }

      this.sendNotificationToAuthor(
        article,
        me,
        'Du har fått en ny gillning',
        `${me.first_name} ${me.last_name} har gillat din artikel "${article.header}"`,
        'LIKE',
      );

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
      if (!ctx.user) throw new Error('User not logged in');
      const me = await this.getMemberFromKeycloakId(ctx.user?.keycloak_id);
      if (!me) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await dbUtils.unique(this.knex<sql.Article>('articles').where({ id }));
      if (!article) throw new UserInputError('Article id does not exist');

      await this.knex<sql.Comment>('article_comments').insert({
        article_id: id,
        member_id: me.id,
        content,
        published: new Date(),
      });

      this.sendNotificationToAuthor(
        article,
        me,
        'Du har fått en ny kommentar',
        `${me.first_name} ${me.last_name} har kommenterat på din artikel "${article.header}"`,
        'COMMENT',
      );

      const mentionedStudentIds: string[] | undefined = content
        .match(/\((\/members[^)]+)\)/g)
        ?.map((m) => m
          .replace(/\(|\/members\/|\/\)/g, '')
          .replace(')', ''));
      if (mentionedStudentIds?.length) {
        this.sendMentionNotifications(
          article,
          me,
          mentionedStudentIds,
        );
      }

      return {
        article: convertArticle({
          article,
          comments: await this.getComments(id),
        }),
      };
    });
  }

  private async sendMentionNotifications(
    article: sql.Article,
    commenter: Member,
    studentIds: string[],
  ) {
    const students = await this.knex<Member>('members').whereIn('student_id', studentIds);
    if (students.length) {
      await this.addNotification({
        title: 'Du har blivit nämnd i en kommentar',
        message: `${commenter.first_name} ${commenter.last_name} har nämnt dig i "${article.header}"`,
        memberIds: students.map((s) => s.id),
        type: 'MENTION',
        link: `/news/article/${article.slug || article.id}`,
      });
    } else {
      notificationsLogger.info(`No students found for mentioned student ids: ${studentIds}`);
    }
  }

  private async sendNotificationToAuthor(
    article: sql.Article,
    me: sqlMember,
    title: string,
    message: string,
    type: string,
  ): Promise<void> {
    const link = `/news/article/${article.slug}`;
    let memberId = article.author_id;
    if (article.author_type === 'Mandate') {
      const mandate = await dbUtils.unique(this.knex<Mandate>('mandates').where({ id: article.author_id }));
      if (!mandate) throw new Error('Mandate not found');
      memberId = mandate.member_id;
    }
    this.addNotification({
      title,
      message,
      type,
      link,
      memberIds: [memberId],
    });
  }

  private async sendNewArticleNotification(
    article: sql.Article,
    title: string,
    message?: string,
    tagIds?: UUID[],
  ) {
    const subscribedMemberIDs: UUID[] = (
      await this.knex<TagSubscription>('tag_subscriptions')
        .select('member_id')
        .whereIn('tag_id', tagIds || [])
    ).map((t) => t.member_id);

    this.addNotification({
      title: `Ny nyhet: ${title}`,
      message: message || '',
      type: 'NEW_ARTICLE',
      link: `/news/article/${article.slug || article.id}`,
      memberIds: subscribedMemberIDs,
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
    return this.withAccess(['news:article:update', 'news:article:create'], ctx, async () => {
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
    return this.withAccess(['news:article:update', 'news:article:create'], ctx, async () => {
      const deletedRowAmount = await this.knex<sql.ArticleTag>('article_tags').where({
        article_id: articleId,
      }).whereIn('tag_id', tagIds).del();
      return deletedRowAmount;
    });
  }

  removeAllTagsFromArticle(
    ctx: context.UserContext,
    articleId: UUID,
  ): Promise<number> {
    return this.withAccess(['news:article:update', 'news:article:create'], ctx, async () => {
      const deletedRowAmount = await this.knex<sql.ArticleTag>('article_tags').where({
        article_id: articleId,
      }).del();
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

  async getAlerts(): Promise<gql.Alert[]> {
    const alerts = await this.knex<sql.Alert>('alerts').whereNull('removed_at').select('*');
    return alerts.map((a) => ({
      id: a.id,
      message: a.message,
      messageEn: a.message_en,
      severity: a.severity as gql.AlertColor,
    }));
  }

  createAlert(
    ctx: context.UserContext,
    message: string,
    messageEn: string,
    severity: gql.AlertColor,
  ):
    Promise<gql.Alert> {
    return this.withAccess('alert', ctx, async () => {
      const newAlert = (await this.knex<sql.Alert>('alerts').insert({
        message,
        message_en: messageEn,
        severity,
      }).returning('id'))[0];
      return {
        id: newAlert.id,
        message,
        messageEn,
        severity,
      };
    });
  }

  removeAlert(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Alert> {
    return this.withAccess('alert', ctx, async () => {
      const alert = (await this.knex<sql.Alert>('alerts').where({ id }).select('*'))[0];
      if (!alert) {
        throw new ApolloError('Alert not found');
      }
      await this.knex<sql.Alert>('alerts').where({ id }).update({
        removed_at: new Date(),
      });
      return {
        id: alert.id,
        message: alert.message,
        messageEn: alert.message_en,
        severity: alert.severity as gql.AlertColor,
      };
    });
  }
}
