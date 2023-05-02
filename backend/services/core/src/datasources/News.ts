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
import { convertMember } from './Member';

type AuthorArticle = Omit<gql.Article, 'author'> & {
  author: gql.Mandate | gql.Member;
};
const notificationsLogger = createLogger('notifications');

export async function getAuthor<T extends Pick<gql.Article, 'author'>>(
  article: T,
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
export async function getHandledBy(
  article: gql.Article | gql.ArticleRequest,
  dataSources: DataSources,
  ctx: context.UserContext,
): Promise<gql.Maybe<gql.Member>> {
  if (article.handledBy?.id === undefined) {
    return undefined;
  }
  const member: gql.Member = {
    ...await dataSources
      .memberAPI.getMember(ctx, { id: article.handledBy.id }),
    __typename: 'Member',
    id: article.handledBy.id,
  };
  return member;
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
    is_default: isDefault,
    ...rest
  } = tag;
  return {
    nameEn: nameEn ?? tag.name,
    isDefault,
    ...rest,
  };
}

const resolveStatus = (status: sql.Article['status']): gql.ArticleRequestStatus => {
  switch (status) {
    case 'draft':
      return gql.ArticleRequestStatus.Draft;
    case 'approved':
      return gql.ArticleRequestStatus.Approved;
    case 'rejected':
      return gql.ArticleRequestStatus.Rejected;
    default:
      throw new Error(`Unknown status ${status}`);
  }
};

export function convertArticle({
  article,
  numberOfLikes,
  isLikedByMe,
  tags = [],
  likers = [],
  comments = [],
  handledBy = undefined,
}: {
  article: sql.Article,
  numberOfLikes?: number,
  isLikedByMe?: boolean,
  tags?: gql.Tag[],
  likers?: gql.Member[],
  comments?: gql.Comment[],
  handledBy?: gql.Member,
}) {
  const {
    published_datetime: publishedDate,
    latest_edit_datetime: latestEditDate,
    author_id: authorId,
    author_type: authorType,
    image_url: imageUrl,
    body_en: bodyEn,
    header_en: headerEn,
    created_datetime: createdDatetime,
    status,
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
    id: article.id,
    author,
    imageUrl: imageUrl ?? undefined,
    bodyEn: bodyEn ?? undefined,
    headerEn: headerEn ?? undefined,
    publishedDatetime: publishedDate ? new Date(publishedDate) : undefined,
    createdDatetime: createdDatetime ? new Date(createdDatetime) : undefined,
    latestEditDatetime: latestEditDate ? new Date(latestEditDate) : undefined,
    likes: numberOfLikes ?? 0,
    isLikedByMe: isLikedByMe ?? false,
    handledBy,
    tags,
    likers,
    comments,
    status: resolveStatus(status),
  };
  return a;
}

export function convertArticleRequest({
  article,
  tags = [],
  handledBy,
}: {
  article: sql.Article & sql.ArticleRequest,
  tags?: gql.Tag[],
  handledBy?: gql.Member,
}) {
  const a: gql.Article = convertArticle({
    article,
    tags,
  });
  const {
    created_datetime: createdDatetime,
    rejected_datetime: rejectedDatetime,
    rejection_reason: rejectionReason,
    status,
  } = article;
  const articleReq: gql.ArticleRequest = {
    ...a,
    __typename: 'ArticleRequest',
    id: article.article_id || article.id,
    createdDatetime: new Date(createdDatetime),
    rejectedDatetime: rejectedDatetime ? new Date(rejectedDatetime) : undefined,
    rejectionReason: rejectionReason ?? undefined,
    handledBy,
    status: resolveStatus(status),
  };
  return articleReq;
}

export const convertComment = (
  comment: Omit<sql.Comment, 'article_id'>,
  members: Member[],
  ctx: context.UserContext,
): gql.Comment => ({
  id: comment.id,
  content: comment.content,
  member: convertMember(members
    .find((m) => m.id === comment.member_id)!, ctx),
  published: comment.published,
});

export default class News extends dbUtils.KnexDataSource {
  private async getRawArticle(
    ctx: context.UserContext,
    id?: UUID,
    slug?: string,
  ): Promise<{ article: sql.Article, handledBy: gql.Member | undefined } | undefined> {
    return this.withAccess('news:article:read', ctx, async () => {
      if (!slug && !id) return undefined;
      const query = this.knex<sql.Article>('articles').whereNull('removed_at');
      if (id) {
        query.where({ id });
      } else if (slug) {
        query.where({ slug });
      }
      const article = await query.first();
      if (!article) return undefined;
      let handledBy: gql.Maybe<gql.Member>;
      if (await this.hasAccess('news:article:manage', ctx)) {
        const handledById = await this.knex<sql.ArticleRequest>('article_requests')
          .where('article_requests.article_id', '=', article.id)
          .select('handled_by')
          .first();
        handledBy = handledById?.handled_by ? {
          __typename: 'Member',
          id: handledById.handled_by,
        } : undefined;
      }
      return { article, handledBy };
    });
  }

  async getArticle(
    ctx: context.UserContext,
    dataSources: DataSources,
    id?: UUID,
    slug?: string,
  ): Promise<gql.Maybe<gql.Article>> {
    const result = await this.getRawArticle(ctx, id, slug);
    if (!result) return undefined;
    if (result.article.status !== 'approved' && !await this.hasAccess('news:article:manage', ctx)) {
      if (!ctx.user) return undefined;
      // Check if it's the user's own article
      const member = await this.getMemberFromKeycloakId(ctx.user.keycloak_id);
      if (result.article.author_type === 'Member') {
        if (result.article.author_id !== member.id) {
          return undefined;
        }
      } else {
        const mandate = await dataSources.mandateAPI.getMandate(ctx, result.article.author_id);
        if (!mandate) return undefined;
        if (mandate.member?.id !== member.id) {
          return undefined;
        }
      }
    }
    return convertArticle(
      { ...result },
    );
  }

  getArticles(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    tagIds?: string[],
    showAll?: boolean,
  ): Promise<gql.ArticlePagination> {
    return this.withAccess('news:article:read', ctx, async () => {
      let query = this.knex<sql.Article & sql.ArticleTag>('articles')
        .whereNull('removed_at').andWhere({ status: 'approved' });
      if (tagIds?.length) {
        query = query
          .join<sql.ArticleTag>('article_tags', 'article_tags.article_id', 'articles.id')
          .whereIn('article_tags.tag_id', tagIds);
      }
      const studentId = ctx.user?.student_id;
      if (!tagIds?.length && !showAll && studentId) {
        const blacklistedTags = await this.knex<sql.TagBlacklist>('tag_blacklists')
          .select('tag_id')
          .join('members', 'members.id', 'tag_blacklists.member_id')
          .where({ student_id: studentId });
        if (blacklistedTags.length > 0) {
          query = query
            .leftJoin('article_tags', 'article_tags.article_id', 'articles.id')
            .andWhere((k) => {
              k
                .whereNull('article_tags.tag_id')
                .orWhereNotIn('article_tags.tag_id', blacklistedTags.map((t) => t.tag_id));
            });
        }
      }

      const result = await query
        .select<sql.Article>('articles.*')
        .distinct('articles.id', 'published_datetime')
        .orderBy('published_datetime', 'desc')
        .paginate({ perPage, currentPage: page, isLengthAware: true });
      return {
        articles: result.data.map((article: sql.Article) => convertArticle({ article })),
        pageInfo: dbUtils.createPageInfoFromPagination(result.pagination),
      };
    });
  }

  async getArticleRequest(
    ctx: context.UserContext,
    dataSources: DataSources,
    id?: UUID,
    slug?: string,
  ) {
    const result = await this.getRawArticle(ctx, id, slug);
    if (!result) return undefined;
    const { article, handledBy } = result;
    const memberId = article.author_type === 'Member'
      ? article.author_id
      : (await dataSources.mandateAPI.getMandate(ctx, article.author_id))?.member?.id;
    return this.withAccess('news:article:manage', ctx, async () => {
      const request = await this.knex<sql.ArticleRequest>('article_requests').where({ article_id: article.id }).first();
      if (!request) {
        return undefined;
      }
      return convertArticleRequest({
        article: { ...article, ...request }, handledBy,
      });
    }, memberId);
  }

  async getArticleRequests(
    ctx: context.UserContext,
    dataSources: DataSources,
    limit?: number,
  ): Promise<gql.ArticleRequest[]> {
    return this.withAccess('news:article:create', ctx, async () => {
      let query = this.knex<sql.Article>('articles')
        .whereNull('removed_at')
        .andWhere({ status: 'draft' })
        .innerJoin<sql.ArticleRequest>('article_requests', 'article_requests.article_id', 'articles.id');
      if (limit) {
        query = query.limit(limit);
      }
      let articles = await query.orderBy('created_datetime', 'desc');

      /* If user doesn't have access, only show THEIR requests
      I tried doing this at SQL-level, but since author is EITHER member or mandate
        it's simpler like this
      ArticleRequests where status=draft should be quite few, probably < 10 rows.
        This should therefore be fast
    */
      if (!(await this.hasAccess('news:article:manage', ctx))) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

        if (!user) {
          throw new ApolloError('Could not find member based on keycloak id');
        }
        const articlePromises = await Promise.all(
          articles
            .map(async (article) => ({
              memberId: await getAuthorMemberID(convertArticle({ article }), dataSources, ctx),
              article,
            })),
        );
        articles = articlePromises
          .filter(({ memberId }) => memberId === user.member_id)
          .map(({ article }) => article);
      }
      return articles.map((article) => convertArticleRequest({ article }));
    });
  }

  async getRejectedArticles(
    ctx: context.UserContext,
    dataSources: DataSources,
    page: number,
    perPage: number,
  ): Promise<gql.ArticleRequestPagination> {
    return this.withAccess('news:article:create', ctx, async () => {
      const result = await this.knex<sql.Article>('articles')
        .whereNull('removed_at')
        .andWhere({ status: 'rejected' })
        .innerJoin<sql.ArticleRequest>('article_requests', 'article_requests.article_id', 'articles.id')
        .orderBy('rejected_datetime', 'desc')
        .paginate({ perPage, currentPage: page, isLengthAware: true });

      /* If user doesn't have access, only show THEIR requests
        I tried doing this at SQL-level, but since author is EITHER member or mandate
          it's simpler like this
        ArticleRequests where status=draft should be quite few, probably < 10 rows.
          This should therefore be fast
      */
      let articles = result.data;
      if (!(await this.hasAccess('news:article:manage', ctx))) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

        if (!user) {
          throw new ApolloError('Could not find member based on keycloak id');
        }
        const articlePromises = await Promise.all(
          articles
            .map(async (article) => ({
              memberId: await getAuthorMemberID(convertArticle({ article }), dataSources, ctx),
              article,
            })),
        );
        articles = articlePromises
          .filter(({ memberId }) => memberId === user.member_id)
          .map(({ article }) => article);
      }
      return {
        articles: articles.map((article) => convertArticleRequest({
          article,
          handledBy: article.handled_by ? {
            __typename: 'Member',
            id: article.handled_by,
          } : undefined,
        })),
        pageInfo: dbUtils.createPageInfoFromPagination(result.pagination),
      };
    });
  }

  async getApprovedBy(
    ctx: context.UserContext,
    articleId: UUID,
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const articleRequest = await this.knex<sql.ArticleRequest>('article_request')
        .where({ article_id: articleId })
        .whereNotNull('approved_datetime')
        .first();
      if (!articleRequest) {
        return undefined;
      }
      const member = await this.knex<sqlMember>('members').where({ id: articleRequest.handled_by }).first();
      if (!member) {
        throw new UserInputError(`member with id ${articleRequest.handled_by} does not exist`);
      }
      return convertMember(member, ctx);
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

  async getLikers(
    ctx: context.UserContext,
    article_id: UUID,
  ): Promise<gql.Member[]> {
    const likes = await this.knex<sql.Like>('article_likes').where({ article_id });
    const memberIds: string[] = [...new Set(likes.map((l) => l.member_id))];
    const members = await this.knex<sqlMember>('members').whereIn('id', memberIds);
    return members.map((m) => convertMember(m, ctx));
  }

  async getComments(ctx: context.UserContext, article_id: UUID): Promise<gql.Comment[]> {
    const sqlComments = await this.knex<sql.Comment>('article_comments').where({ article_id }).orderBy('published', 'asc');
    const memberIds: string[] = [...new Set(sqlComments.map((c) => c.member_id))];
    const members = await this.knex<Member>('members').whereIn('id', memberIds);
    const comments: gql.Comment[] = sqlComments.map((c) => convertComment(c, members, ctx));
    return comments;
  }

  async getComment(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Comment>> {
    const sqlComment = await this.knex<sql.Comment>('article_comments').where({ id }).first();
    const member = await this.knex<Member>('members').where('id', sqlComment?.member_id).first();
    if (!sqlComment) throw new UserInputError(`Comment with id ${id} does not exist`);
    if (!member) throw new UserInputError(`Member with id ${sqlComment.member_id} does not exist`);
    return convertComment(sqlComment, [member], ctx);
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

  async createArticle(
    ctx: context.UserContext,
    articleInput: gql.CreateArticle,
  ): Promise<gql.Maybe<gql.CreateArticlePayload>> {
    if (!ctx.user?.keycloak_id) {
      throw new ApolloError('Not authenticated');
    }
    const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

    if (!user) {
      throw new ApolloError('Could not find member based on keycloak id');
    }

    const authorPromise = this.resolveAuthor(user, articleInput.mandateId);

    const uploadUrlPromise = this.getUploadData(ctx, articleInput.imageName, articleInput.header);
    const canManagePromise = this.hasAccess('news:article:manage', ctx);

    const [author, uploadData, shouldPublishDirectly] = await Promise.all([
      authorPromise,
      uploadUrlPromise,
      canManagePromise, // If they can manage articles, publish directly
    ]);

    if (!author) {
      throw new ApolloError('Could not find author');
    }

    const newArticle: Omit<sql.Article, 'id' | 'created_datetime'> = {
      header: articleInput.header,
      header_en: articleInput.headerEn,
      body: articleInput.body,
      body_en: articleInput.bodyEn,
      image_url: uploadData?.fileUrl,
      slug: await this.slugify('articles', articleInput.header),
      status: 'draft',
      ...author,
    };
    if (shouldPublishDirectly) {
      newArticle.published_datetime = new Date();
      newArticle.status = 'approved';
    }

    const article = (await this.knex<sql.Article>('articles').insert(newArticle).returning('*'))[0];

    let tags: gql.Tag[] | undefined;
    if (articleInput.tagIds?.length) {
      await this.addTags(ctx, article.id, articleInput.tagIds);
      tags = await this.getTags(article.id);
    }
    if (shouldPublishDirectly) {
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
    } else {
      await this.knex<sql.ArticleRequest>('article_requests').insert({
        article_id: article.id,
        should_send_notification: articleInput.sendNotification,
        notification_body: articleInput.notificationBody,
        notification_body_en: articleInput.notificationBodyEn,
      });
    }
    return {
      article: convertArticle({
        article, numberOfLikes: 0, isLikedByMe: false, tags,
      }),
      uploadUrl: uploadData?.uploadUrl,
    };
  }

  async approveArticle(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const article = await this.knex<sql.Article>('articles').whereNull('removed_at').andWhere({ status: 'draft', id }).first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist`);
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }
      const memberID = user.member_id;
      const tags = await this.getTags(id);
      const [updatedArticle] = await this.knex<sql.Article>('articles')
        .where({ id })
        .update({ status: 'approved', published_datetime: new Date() })
        .returning('*');
      const [updatedArticleRequest] = await this.knex<sql.ArticleRequest>('article_requests')
        .where({ article_id: id })
        .update({ approved_datetime: new Date(), handled_by: memberID })
        .returning('*');
      meilisearchAdmin.addArticleToSearchIndex(updatedArticle);
      if (updatedArticleRequest.should_send_notification) {
        this.sendNewArticleNotification(
          updatedArticle,
          updatedArticle.header,
          updatedArticleRequest.notification_body || updatedArticleRequest.notification_body_en,
          tags.map((t) => t.id),
        );
      }
      this.sendNotificationToAuthor(
        updatedArticle,
        'Din nyhet blev godkännd',
        `"${updatedArticle.header}" är nu publicerad.`,
        // See comment in Notifications.ts why I chose 'COMMENT'.
        // We can't change the internal name as it would break existing notifications
        'COMMENT',
      );
      return convertArticleRequest({
        article: { ...updatedArticle, ...updatedArticleRequest },
        tags,
      });
    });
  }

  async rejectArticle(
    ctx: context.UserContext,
    id: UUID,
    reason?: string,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const article = await this.knex<sql.Article>('articles').whereNull('removed_at').andWhere({ status: 'draft', id }).first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist`);
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }
      const memberID = user.member_id;
      const tags = await this.getTags(id);
      const [updatedArticle] = await this.knex<sql.Article>('articles')
        .where({ id })
        .update({ status: 'rejected' })
        .returning('*');
      const [updatedArticleRequest] = await this.knex<sql.ArticleRequest>('article_requests')
        .where({ article_id: id })
        .update({ rejected_datetime: new Date(), rejection_reason: reason, handled_by: memberID })
        .returning('*');
      this.sendNotificationToAuthor(
        updatedArticle,
        'Din nyhet blev avvisad',
        reason ? `"${updatedArticle.header}" med anledning: ${reason}` : `"${updatedArticle.header}" blev avvisad.`,
        // See comment in Notifications.ts why I chose 'COMMENT'.
        // We can't change the internal name as it would break existing notifications
        'COMMENT',
        '/news/requests/rejected',
      );
      return convertArticleRequest({
        article: { ...updatedArticle, ...updatedArticleRequest },
        tags,
      });
    });
  }

  async undoRejection(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const article = await this.knex<sql.Article>('articles').whereNull('removed_at').andWhere({ status: 'rejected', id }).first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist or is not rejected`);

      const tags = await this.getTags(id);
      const [updatedArticle] = await this.knex<sql.Article>('articles')
        .where({ id })
        .update({ status: 'draft' })
        .returning('*');
      const [updatedArticleRequest] = await this.knex<sql.ArticleRequest>('article_requests')
        .where({ article_id: id })
        .update({
          rejected_datetime: this.knex.raw('NULL'),
          rejection_reason: this.knex.raw('NULL'),
          handled_by: this.knex.raw('NULL'),
        })
        .returning('*');
      this.sendNotificationToAuthor(
        updatedArticle,
        'Din nyhet blev återställd',
        `"${updatedArticle.header}" är nu återställd till utkast.`,
        // See comment in Notifications.ts why I chose 'COMMENT'.
        // We can't change the internal name as it would break existing notifications
        'COMMENT',
        '/news/requests',
      );
      return convertArticleRequest({
        article: { ...updatedArticle, ...updatedArticleRequest },
        tags,
      });
    });
  }

  async updateArticle(
    ctx: context.UserContext,
    dataSources: DataSources,
    articleInput: gql.UpdateArticle,
    id: UUID,
  ): Promise<gql.Maybe<gql.UpdateArticlePayload>> {
    const originalArticle = await this.getArticle(ctx, dataSources, id);
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
    dataSources: DataSources,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticlePayload>> {
    const article = await this.getArticle(ctx, dataSources, id, undefined);
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
    dataSources: DataSources,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticlePayload>> {
    const comment = await this.knex<sql.Comment>('article_comments').where({ id }).first();
    return this.withAccess('news:article:comment:delete', ctx, async () => {
      if (!comment) throw new UserInputError('comment id did not exist');
      const article = await this.getArticle(ctx, dataSources, comment?.article_id);
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
          comments: await this.getComments(ctx, id),
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
        link: `/news/article/${article.slug ?? article.id}`,
      });
    } else {
      notificationsLogger.info(`No students found for mentioned student ids: ${studentIds}`);
    }
  }

  private async sendNotificationToAuthor(
    article: sql.Article,
    title: string,
    message: string,
    type: string,
    customLink?: string,
  ): Promise<void> {
    const link = customLink ?? `/news/article/${article.slug ?? article.id}`;
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
        .whereIn('tag_id', tagIds ?? [])
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
