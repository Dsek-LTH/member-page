import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    news: (_, {page, perPage}, {dataSources}) => {
      return dataSources.newsAPI.getArticles(page, perPage);
    },
    article: (_, {id}, {dataSources}) => {
      return dataSources.newsAPI.getArticle(id);
    }
  },
  Mutation: {
    article: () => ({}),
  },
  ArticleMutations: {
    create: (_, {input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.createArticle(input.header, input.body, user.keycloak_id, input.header_en, input.body_en);
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.updateArticle(id, input.header, input.body, input.header_en, input.body_en);
    },
    remove: (_, {id}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.removeArticle(id);
    }
  },
};

export default resolvers;
