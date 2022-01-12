import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, { page, perPage }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.getArticles(ctx, page, perPage);
    },
    article(_, { id }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.getArticle(ctx, id);
    },
  },
  Mutation: {
    article: () => ({}),
  },
  ArticleMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.createArticle(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.updateArticle(ctx, input, id);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.removeArticle(ctx, id);
    },
    presignedPutUrl(_, { fileName }, { dataSources, ...ctx }) {
      return dataSources.newsAPI.getPresignedPutUrl(ctx, fileName);
    },
  },
};

export default resolvers;
