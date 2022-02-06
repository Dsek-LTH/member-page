import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, { page, perPage }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticles({ user, roles }, page, perPage);
    },
    article(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id);
    },
  },
  Mutation: {
    article: () => ({}),
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
};

export default resolvers;
