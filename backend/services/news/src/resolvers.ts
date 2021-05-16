import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';
import { GraphQLUpload } from 'graphql-upload';

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
      return dataSources.newsAPI.createArticle(input.header, input.body, user.keycloak_id, input.header_en, input.body_en, input.image_name);
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.updateArticle(id, input.header, input.body, input.header_en, input.body_en, input.image_name);
    },
    remove: (_, {id}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.removeArticle(id);
    },
    uploadImage: (_, {fileName}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.newsAPI.uploadImage(fileName)
    }
    
  },
  Upload: GraphQLUpload,
};

export default resolvers;
