import { ApolloError, UserInputError } from 'apollo-server';
import { convertAuthor } from './Author';
import { Author } from '../types/author';
import type { DataSources } from '../datasources';
import
{
  UUID,
  context, createLogger, dbUtils, minio,
} from '../shared';
import meilisearchAdmin from '../shared/meilisearch';
import { slugify } from '../shared/utils';
import { Member as sqlMember } from '../types/database';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import { TagSubscription } from '../types/notifications';
import { convertMember, getFullName } from './Member';
import { NotificationType } from '../shared/notifications';

const notificationsLogger = createLogger('notifications');

export type JoinedArticle = sql.Article & {
  author: Author,
  member: sqlMember,
};

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
    id: article.handledBy.id,
  };
  return member;
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
  article: JoinedArticle,
  numberOfLikes?: number,
  isLikedByMe?: boolean,
  tags?: gql.Tag[],
  likers?: gql.Member[],
  comments?: gql.Comment[],
  handledBy?: gql.Member,
}, ctx: context.UserContext) {
  const {
    published_datetime: publishedDate,
    latest_edit_datetime: latestEditDate,
    image_url: imageUrl,
    body_en: bodyEn,
    header_en: headerEn,
    created_datetime: createdDatetime,
    status,
    author,
    member,
    author_id: authorId,
    ...rest
  } = article;
  const a: gql.Article = {
    ...rest,
    id: article.id,
    author: convertAuthor({ ...author, member }, ctx),
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
  article: JoinedArticle & sql.ArticleRequest,
  tags?: gql.Tag[],
  handledBy?: gql.Member,
}, ctx: context.UserContext) {
  const a: gql.Article = convertArticle({
    article,
    tags,
  }, ctx);
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
  members: sqlMember[],
  ctx: context.UserContext,
): gql.Comment => ({
  id: comment.id,
  content: comment.content,
  member: convertMember(members
    .find((m) => m.id === comment.member_id)!, ctx),
  published: comment.published,
});

export default class News extends dbUtils.KnexDataSource {
  private selectArticles(id?: UUID) {
    let query = this.knex('articles')
      .select<JoinedArticle[]>(
      'articles.*',
      this.knex.raw('to_json(authors.*) as author'),
      this.knex.raw('to_json(members.*) as member'),
    )
      .join('authors', 'authors.id', '=', 'articles.author_id')
      .join('members', 'members.id', '=', 'authors.member_id');
    if (id) {
      query = query.where({ 'articles.id': id });
    }
    // query.then((rows) => {
    //   console.log(rows);
    //   rows.map((article) => ({
    //     ...article,
    //     author: (article.author as unknown as string | undefined)
    //       ? (JSON.parse(article.author as unknown as string) as Author)
    //       : undefined,
    //     member: (article.member as unknown as string | undefined)
    //       ? (JSON.parse(article.member as unknown as string) as sqlMember)
    //       : undefined,
    //   }));
    // });
    return query;
  }

  private async getRawArticle(
    ctx: context.UserContext,
    id?: UUID,
    slug?: string,
  ): Promise<{
      article: JoinedArticle,
      handledBy: gql.Member | undefined
    } | undefined> {
    return this.withAccess('news:article:read', ctx, async () => {
      if (!slug && !id) return undefined;
      const query = this.selectArticles().whereNull('removed_at');
      if (id) {
        query.where({ 'articles.id': id });
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
      const author = await dataSources.authorAPI.getAuthor(ctx, result.article.author_id);
      if (author?.member.id !== member?.id) {
        return undefined;
      }
    }
    return convertArticle({ ...result }, ctx);
  }

  getArticles(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    tagIds?: string[],
    nollning?: boolean,
  ): Promise<gql.ArticlePagination> {
    return this.withAccess('news:article:read', ctx, async () => {
      let query = this.selectArticles().whereNull('removed_at').andWhere({ status: 'approved' });
      if (tagIds?.length) {
        query = query
          .join<sql.ArticleTag>('article_tags', 'article_tags.article_id', 'articles.id')
          .whereIn('article_tags.tag_id', tagIds);
      }

      // Handle nollning filter separately from other tags
      const nollningTagId = await this.getNollningTagId();
      if (nollningTagId) {
        if (nollning) {
          query = query.whereExists((qb) => {
            qb.select('*')
              .from('article_tags')
              .whereRaw('article_tags.article_id = articles.id')
              .where('article_tags.tag_id', nollningTagId);
          });
        } else {
          query = query.whereNotExists((qb) => {
            qb.select('*')
              .from('article_tags')
              .whereRaw('article_tags.article_id = articles.id')
              .where('article_tags.tag_id', nollningTagId);
          });
        }
      }

      const result = await query
        .distinctOn('articles.id', 'published_datetime')
        .orderBy('published_datetime', 'desc')
        .paginate({ perPage, currentPage: page, isLengthAware: true });
      return {
        articles: result.data.map((article) => convertArticle({ article }, ctx)),
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
    const memberId = article.member?.id ?? article.author?.member_id;
    if (!memberId) throw new ApolloError('Article has no author member id');
    return this.withAccess('news:article:manage', ctx, async () => {
      const request = await this.knex<sql.ArticleRequest>('article_requests').where({ article_id: article.id }).first();
      if (!request) {
        return undefined;
      }
      return convertArticleRequest({
        article: { ...article, ...request }, handledBy,
      }, ctx);
    }, memberId);
  }

  async getArticleRequests(
    ctx: context.UserContext,
    dataSources: DataSources,
    limit?: number,
  ): Promise<gql.ArticleRequest[]> {
    return this.withAccess('news:article:create', ctx, async () => {
      const memberId = await this.getCurrentMemberId(ctx);
      let query = this.selectArticles().whereNull('removed_at').andWhere({ status: 'draft' })
        .select<(sql.ArticleRequest & JoinedArticle)[]>('article_requests.*')
        .innerJoin<sql.ArticleRequest>('article_requests', 'article_requests.article_id', 'articles.id');
      if (limit) {
        query = query.limit(limit);
      }
      if (!(await this.hasAccess('news:article:manage', ctx))) {
        query = query.where({ 'members.id': memberId });
      }
      const articles = await query.orderBy('created_datetime', 'desc');

      return articles.map((article) => convertArticleRequest({ article }, ctx));
    });
  }

  async getRejectedArticles(
    ctx: context.UserContext,
    dataSources: DataSources,
    page: number,
    perPage: number,
  ): Promise<gql.ArticleRequestPagination> {
    return this.withAccess('news:article:create', ctx, async () => {
      const memberId = await this.getCurrentMemberId(ctx);
      let query = this.selectArticles()
        .whereNull('removed_at').andWhere({ status: 'rejected' })
        .select<(sql.ArticleRequest & JoinedArticle)[]>('article_requests.*')
        .innerJoin<sql.ArticleRequest>('article_requests', 'article_requests.article_id', 'articles.id')
        .orderBy('rejected_datetime', 'desc')
        .paginate({ perPage, currentPage: page, isLengthAware: true });
      if (!(await this.hasAccess('news:article:manage', ctx))) {
        query = query.where({ 'members.id': memberId });
      }
      const result = await query;

      const articles: (sql.ArticleRequest & JoinedArticle)[] = result.data;
      return {
        articles: articles.map((article) => convertArticleRequest({
          article,
          handledBy: article.handled_by ? {
            id: article.handled_by,
          } : undefined,
        }, ctx)),
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
    const members = await this.knex<sqlMember>('members').whereIn('id', memberIds);
    const comments: gql.Comment[] = sqlComments.map((c) => convertComment(c, members, ctx));
    return comments;
  }

  async getComment(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Comment>> {
    const sqlComment = await this.knex<sql.Comment>('article_comments').where({ id }).first();
    const member = await this.knex<sqlMember>('members').where('id', sqlComment?.member_id).first();
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
    dataSources: DataSources,
  ): Promise<gql.Maybe<gql.CreateArticlePayload>> {
    if (!ctx.user?.keycloak_id) {
      throw new ApolloError('Not authenticated');
    }
    const memberId = await this.getCurrentMemberId(ctx);

    if (!memberId) {
      throw new ApolloError('Could not find member based on keycloak id');
    }

    const memberPromise = dataSources.memberAPI.getMemberRaw({ id: memberId });

    const authorPromise = dataSources.authorAPI.createAuthor(ctx, articleInput.author);

    const uploadUrlPromise = this.getUploadData(ctx, articleInput.imageName, articleInput.header);
    const canManagePromise = this.hasAccess('news:article:manage', ctx);

    const [author, uploadData, shouldPublishDirectly, member] = await Promise.all([
      authorPromise,
      uploadUrlPromise,
      canManagePromise, // If they can manage articles, publish directly
      memberPromise,
    ]);

    if (!author) { throw new ApolloError('Could not find author'); }
    if (!member) { throw new ApolloError('Could not find member'); }

    const newArticle: Omit<sql.Article, 'id' | 'created_datetime'> = {
      header: articleInput.header,
      header_en: articleInput.headerEn,
      body: articleInput.body,
      body_en: articleInput.bodyEn,
      image_url: uploadData?.fileUrl,
      slug: await this.slugify('articles', articleInput.header),
      status: 'draft',
      author_id: author.id,
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

        this.sendNewArticleNotification({
          article,
          title: article.header,
          message: (notificationBody?.length ?? 0) > 0 ? notificationBody : undefined,
          tagIds: articleInput.tagIds,
        });
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
        article: { ...article, author, member }, numberOfLikes: 0, isLikedByMe: false, tags,
      }, ctx),
      uploadUrl: uploadData?.uploadUrl,
    };
  }

  async approveArticle(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const myMemberId = await this.getCurrentMemberId(ctx);
      const article = await this.selectArticles().whereNull('removed_at').andWhere({
        status: 'draft',
        'articles.id': id,
      }).first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist`);
      const tags = await this.getTags(id);
      const [updatedArticle] = await this.selectArticles(id)
        .update({ status: 'approved', published_datetime: new Date() })
        .returning('*');
      const [updatedArticleRequest] = await this.knex<sql.ArticleRequest>('article_requests')
        .where({ article_id: id })
        .update({ approved_datetime: new Date(), handled_by: myMemberId })
        .returning('*');
      meilisearchAdmin.addArticleToSearchIndex(updatedArticle);
      if (updatedArticleRequest.should_send_notification) {
        this.sendNewArticleNotification({
          article: updatedArticle,
          title: updatedArticle.header,
          message: updatedArticleRequest.notification_body
          || updatedArticleRequest.notification_body_en,
          tagIds: tags.map((t) => t.id),
        });
      }
      this.sendNotificationToAuthor(
        updatedArticle,
        'Din nyhet blev godkännd',
        `"${updatedArticle.header}" är nu publicerad.`,
        // See comment in Notifications.ts why I chose 'COMMENT'.
        // We can't change the internal name as it would break existing notifications
        NotificationType.ARTICLE_UPDATE,
        myMemberId,
      );
      return convertArticleRequest({
        article: { ...updatedArticle, ...updatedArticleRequest },
        tags,
      }, ctx);
    });
  }

  async rejectArticle(
    ctx: context.UserContext,
    id: UUID,
    reason?: string,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const article = await this.selectArticles()
        .whereNull('removed_at').andWhere({ status: 'draft', 'articles.id': id })
        .first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist`);
      const memberID = await this.getCurrentMemberId(ctx);

      const tags = await this.getTags(id);
      const [updatedArticle] = await this.selectArticles(id)
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
        NotificationType.ARTICLE_UPDATE,
        memberID,
        '/news/requests/rejected',
      );
      return convertArticleRequest({
        article: { ...article, ...updatedArticle, ...updatedArticleRequest },
        tags,
      }, ctx);
    });
  }

  async undoRejection(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.ArticleRequest>> {
    return this.withAccess('news:article:manage', ctx, async () => {
      const myMemberId = await this.getCurrentMemberId(ctx);
      const article = await this.selectArticles().whereNull('removed_at').andWhere({ status: 'rejected', 'articles.id': id }).first();
      if (!article) throw new UserInputError(`Article with id ${id} does not exist or is not rejected`);

      const tags = await this.getTags(id);
      const [updatedArticle] = await this.selectArticles(id)
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
        NotificationType.ARTICLE_UPDATE,
        myMemberId,
        '/news/requests',
      );
      return convertArticleRequest({
        article: { ...updatedArticle, ...updatedArticleRequest },
        tags,
      }, ctx);
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
    const memberID = originalArticle.author.member.id;
    return this.withAccess('news:article:update', ctx, async () => {
      if (!originalArticle) {
        throw new UserInputError(`Article with id ${id} does not exist`);
      }

      const uploadData = await this.getUploadData(
        ctx,
        articleInput.imageName,
        articleInput.header || originalArticle.header,
      );
      let author: Pick<sql.Article, 'author_id'> | undefined;

      if (articleInput.author !== undefined) {
        await dataSources.authorAPI.updateAuthor(
          ctx,
          originalArticle.author.id,
          articleInput.author,
        );
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
      const article = await this.selectArticles(id).first();
      if (!article) throw new UserInputError('id did not exist');

      if (articleInput.tagIds !== undefined) {
        await this.removeAllTagsFromArticle(ctx, id);
        if (articleInput.tagIds.length > 0) await this.addTags(ctx, id, articleInput.tagIds);
      }

      return {
        article: convertArticle({ article }, ctx),
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
    const memberID = article.author.member.id;
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
      const me = await this.getCurrentMember(ctx);
      const article = await this.selectArticles(id).first();
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
        article.header,
        `${getFullName(me)} har gillat din nyhet`,
        NotificationType.LIKE,
        me.id,
      );

      return {
        article: convertArticle({
          article,
          numberOfLikes: await this.getLikesCount(id),
          isLikedByMe: true,
        }, ctx),
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

      const article = await this.selectArticles(id).first();
      if (!article) throw new UserInputError('Article id does not exist');

      await this.knex<sql.Comment>('article_comments').insert({
        article_id: id,
        member_id: me.id,
        content,
        published: new Date(),
      });
      // Replace like the following: [@User Name](/members/stil-id) -> @User Name, [test](https://test.com) -> test
      const contentWithoutLinks = content.replaceAll(/\[(.+?)\]\(.+?\)/g, '$1');

      this.sendNotificationToAuthor(
        article,
        `${getFullName(me)} har kommenterat på ${article.header}`,
        contentWithoutLinks,
        NotificationType.COMMENT,
        me.id,
      );

      const mentionedStudentIds: string[] | undefined = content
        .match(/\((\/members[^)]+)\)/g)
        ?.map((m) => m
          .replace(/\(|\/members\/|\/\)/g, '')
          .replace(')', ''));
      if (mentionedStudentIds?.length) {
        this.sendMentionNotifications(
          article,
          contentWithoutLinks,
          me,
          mentionedStudentIds,
        );
      }

      return {
        article: convertArticle({
          article,
          comments: await this.getComments(ctx, id),
        }, ctx),
      };
    });
  }

  private async sendMentionNotifications(
    article: sql.Article,
    message: string,
    commenter: sqlMember,
    studentIds: string[],
  ) {
    const students = await this.knex<sqlMember>('members').whereIn('student_id', studentIds);
    if (students.length) {
      await this.addNotification({
        title: `${getFullName(commenter)} har nämnt dig i "${article.header}"`,
        message,
        memberIds: students.map((s) => s.id),
        type: NotificationType.MENTION,
        link: `/news/article/${article.slug ?? article.id}`,
        fromMemberId: commenter.id,
      });
    } else {
      notificationsLogger.info(`No students found for mentioned student ids: ${studentIds}`);
    }
  }

  private async sendNotificationToAuthor(
    article: JoinedArticle,
    title: string,
    message: string,
    type: NotificationType,
    fromMemberId: UUID,
    customLink?: string,
  ): Promise<void> {
    const link = customLink ?? `/news/article/${article.slug ?? article.id}`;
    const memberId = article.member?.id ?? article.author?.id;
    if (!memberId) throw new ApolloError('Article has no author member id');
    this.addNotification({
      title,
      message,
      type,
      link,
      memberIds: [memberId],
      fromMemberId,
    });
  }

  private async sendNewArticleNotification({
    article,
    title,
    message,
    tagIds,
  }: {
    article: sql.Article,
    title: string,
    message?: string,
    tagIds?: UUID[],
  }) {
    const subscribedMemberIDs: UUID[] = (
      await this.knex<TagSubscription>('tag_subscriptions')
        .select('member_id')
        .whereIn('tag_id', tagIds ?? [])
    ).map((t) => t.member_id);
    let authorMemberId = article.author_id;
    if (article.author_type === 'Mandate') {
      const mandate = await dbUtils.unique(this.knex<Mandate>('mandates').where({ id: article.author_id }));
      if (!mandate) throw new Error('Mandate not found');
      authorMemberId = mandate.member_id;
    }
    // Special link for nolla articles
    const nollningTagId = await this.getNollningTagId();
    const isNollaArticle = nollningTagId && tagIds?.includes(nollningTagId);
    const link = isNollaArticle ? '/nolla/news' : `/news/article/${article.slug || article.id}`;

    this.addNotification({
      title,
      message: message || '',
      type: NotificationType.NEW_ARTICLE,
      link,
      memberIds: subscribedMemberIDs,
      fromMemberId: authorMemberId,
    });
  }

  unlikeArticle(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.ArticlePayload>> {
    return this.withAccess('news:article:like', ctx, async () => {
      const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));

      if (!user) {
        throw new ApolloError('Could not find member based on keycloak id');
      }

      const article = await this.selectArticles(id).first();
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
          ctx,
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
