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
      return dataSources.newsAPI.createArticle(input, user.keycloak_id)
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.updateArticle(input, id);
    },
    remove: (_, {id}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.removeArticle(id);
    },
    presignedPutUrl: (_, {fileName}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.getPresignedPutUrl(fileName)
    }
    
  },
};

export default resolvers;
