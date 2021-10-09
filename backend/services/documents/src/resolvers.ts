import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    bucket: (_, {name, prefix}, {dataSources}) => {
      return dataSources.documentsAPI.getFilesInBucket(name, prefix);
    },
    presignedPutDocumentUrl: (_, {fileName}, {dataSources}) => {
      return dataSources.documentsAPI.getPresignedPutUrl(fileName);
    },
  },
  Mutation: {},
};

export default resolvers;