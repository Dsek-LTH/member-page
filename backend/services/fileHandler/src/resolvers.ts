import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    files: (_, { bucket, prefix }, { dataSources }) => {
      return dataSources.filesAPI.getFilesInBucket(bucket, prefix);
    },
    presignedPutUrl: (_, { bucket, fileName }, { dataSources }) => {
      return dataSources.filesAPI.getPresignedPutUrl(bucket, fileName);
    },
  },
  Mutation: {
    files: () => ({}),
  },
  FileMutations: {
    remove: async (_, { bucket, fileNames }, { dataSources }) => {
      console.log("what")
      return await dataSources.filesAPI.removeObjects(bucket, fileNames);
    },
    move: (_, { bucket, fileNames, newFolder }, { dataSources }) => {
      return dataSources.filesAPI.moveObject(bucket, fileNames, newFolder);
    },
    rename: (_, { bucket, fileName, newFileName }, { dataSources }) => {
      return dataSources.filesAPI.renameObject(bucket, fileName, newFileName);
    },
  }
};

export default resolvers;