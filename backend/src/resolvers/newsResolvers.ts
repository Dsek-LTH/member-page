import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';
import { getAuthor } from '../datasources/News';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, { page, perPage, tagIds }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticles({ user, roles }, page, perPage, tagIds);
    },
    article(_, { id, slug }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id, slug);
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
    alerts(_, __, { dataSources }) {
      return dataSources.newsAPI.getAlerts();
    },

  },
  Mutation: {
    article: () => ({}),
    markdown: () => ({}),
    tags: () => ({}),
    alert: () => ({}),
  },
  Article: {
    __resolveReference({ id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id);
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
    comments({ id }, _, { dataSources }) {
      return dataSources.newsAPI.getComments(id);
    },
    likers({ id }, _, { dataSources }) {
      return dataSources.newsAPI.getLikers(id);
    },
  },
  ArticleMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.createArticle({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.updateArticle({ user, roles }, input, id, dataSources);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeArticle({ user, roles }, id, dataSources);
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
      return dataSources.newsAPI.removeComment({ user, roles }, commentId);
    },
    getUploadData(_, { fileName, header }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getUploadData({ user, roles }, fileName, header);
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
