import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, { page, perPage }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticles({ user, roles }, page, perPage);
    },
    article(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id);
    },
    markdown(_, { name }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdown({ user, roles }, name);
    },
    markdowns(_, __, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdowns({ user, roles });
    },
    tags(_, __, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getTags({ user, roles });
    },
  },
  Mutation: {
    article: () => ({}),
    markdown: () => ({}),
    token: () => ({}),
  },
  TokenMutations: {
    register(_, { expo_token }, { user, roles, dataSources }) {
      return dataSources.notifications.registerToken({ user, roles }, expo_token);
    },
    tags: () => ({}),
  },
  Article: {
    __resolveReference(article, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, article.id);
    },
    likes(article, _, { dataSources }) {
      return dataSources.newsAPI.getLikes(article.id);
    },
    isLikedByMe(article, _, { user, dataSources }) {
      return dataSources.newsAPI.isLikedByUser(
        article.id,
        user?.keycloak_id,
      );
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
      return dataSources.newsAPI.updateArticle({ user, roles }, input, id);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeArticle({ user, roles }, id);
    },
    like(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.likeArticle({ user, roles }, id);
    },
    dislike(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.dislikeArticle({ user, roles }, id);
    },
    presignedPutUrl(_, { fileName }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getPresignedPutUrl({ user, roles }, fileName);
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
};

export default resolvers;
