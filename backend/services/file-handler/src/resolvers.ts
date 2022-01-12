import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    files(_, { bucket, prefix }, { dataSources, ...ctx }) {
      return dataSources.filesAPI.getFilesInBucket(ctx, bucket, prefix);
    },
    presignedPutUrl(_, { bucket, fileName }, { dataSources, ...ctx }) {
      return dataSources.filesAPI.getPresignedPutUrl(ctx, bucket, fileName);
    },
  },
  Mutation: {
    files: () => ({}),
  },
  FileMutations: {
    remove(_, { bucket, fileNames }, { dataSources, ...ctx }) {
      return dataSources.filesAPI.removeObjects(ctx, bucket, fileNames);
    },
    move(_, { bucket, fileNames, newFolder }, { dataSources, ...ctx }) {
      return dataSources.filesAPI.moveObject(ctx, bucket, fileNames, newFolder);
    },
    rename(_, { bucket, fileName, newFileName }, { dataSources, ...ctx }) {
      return dataSources.filesAPI.renameObject(ctx, bucket, fileName, newFileName);
    },
  },
};

export default resolvers;
