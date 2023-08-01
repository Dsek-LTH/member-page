import { DataSources } from '../datasources';
import { getAuthor, getHandledBy } from '../datasources/News';
import { context } from '../shared';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, {
      page, perPage, tagIds, showAll,
    }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticles({ user, roles }, page, perPage, tagIds, showAll);
    },
    article(_, { id, slug }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, dataSources, id, slug);
    },
    articleRequest(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticleRequest({ user, roles }, dataSources, id);
    },
    articleRequests(_, { limit }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticleRequests({ user, roles }, dataSources, limit);
    },
    rejectedRequests(_, { page, perPage }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getRejectedArticles({ user, roles }, dataSources, page, perPage);
    },
    markdown(_, { name }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdown({ user, roles }, name);
    },
    markdowns(_, __, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdowns({ user, roles });
    },
    tag(_, { id }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getTag({ user, roles }, id);
    },
    tags(_, __, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getTags({ user, roles });
    },
    blacklistedTags(_, __, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getBlacklistedTags({ user, roles });
    },
    alerts(_, __, { dataSources }) {
      return dataSources.newsAPI.getAlerts();
    },

  },
  Mutation: {
    article: () => ({}),
    requests: () => ({}),
    markdown: () => ({}),
    tags: () => ({}),
    alert: () => ({}),
  },
  Article: {
    __resolveReference({ id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, dataSources, id);
    },
    async author(article, _, { user, roles, dataSources }) {
      return getAuthor(article, dataSources, { user, roles });
    },
    likes({ id }, _, { dataSources }) {
      return dataSources.newsAPI.getLikesCount(id);
    },
    isLikedByMe({ id }, _, { user, dataSources }) {
      return dataSources.newsAPI.isLikedByUser(
        id,
        user?.keycloak_id,
      );
    },
    tags(article, _, { dataSources }) {
      return dataSources.newsAPI.getTags(article.id);
    },
    comments({ id }, _, { user, roles, dataSources }) {
      return dataSources.newsAPI.getComments({ user, roles }, id);
    },
    likers({ id }, _, { user, roles, dataSources }) {
      return dataSources.newsAPI.getLikers({ user, roles }, id);
    },
  },
  ArticleRequest: {
    __resolveReference({ id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticleRequest({ user, roles }, dataSources, id, undefined);
    },
    async author(article, _, { user, roles, dataSources }) {
      return getAuthor(article as any, dataSources, { user, roles });
    },
    async handledBy(article, _, { user, roles, dataSources }) {
      return getHandledBy(article, dataSources, { user, roles });
    },
    tags(article, _, { dataSources }) {
      return dataSources.newsAPI.getTags(article.id);
    },
  },
  ArticleMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.createArticle({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.updateArticle({ user, roles }, dataSources, input, id);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeArticle({ user, roles }, dataSources, id);
    },
    like(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.likeArticle({ user, roles }, id);
    },
    unlike(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.unlikeArticle({ user, roles }, id);
    },
    comment(_, { id, content }, { user, roles, dataSources }) {
      return dataSources.newsAPI.commentArticle({ user, roles }, id, content);
    },
    removeComment(_, { commentId }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeComment({ user, roles }, dataSources, commentId);
    },
    getUploadData(_, { fileName, header }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getUploadData({ user, roles }, fileName, header);
    },
  },
  RequestMutations: {
    approve(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.approveArticle({ user, roles }, id);
    },
    reject(_, { id, reason }, { user, roles, dataSources }) {
      return dataSources.newsAPI.rejectArticle({ user, roles }, id, reason);
    },
    undoRejection(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.undoRejection({ user, roles }, id);
    },
  },
  MarkdownMutations: {
    update(_, { name, input }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.updateMarkdown(
        { user, roles },
        input,
        name,
      );
    },
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.createMarkdown({ user, roles }, input);
    },
  },
  TagMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.createTag({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.updateTag({ user, roles }, input, id);
    },
    blacklistTag(_, { id }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.blacklistTag({ user, roles }, id);
    },
    unblacklistTag(_, { id }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.unblacklistTag({ user, roles }, id);
    },
  },
  AlertMutations: {
    create(_, { message, messageEn, severity }, { user, roles, dataSources }) {
      return dataSources.newsAPI.createAlert({ user, roles }, message, messageEn, severity);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeAlert({ user, roles }, id);
    },
  },
};

export default resolvers;
