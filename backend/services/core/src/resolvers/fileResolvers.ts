import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const fileResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    files(_, { bucket, prefix, recursive }, { user, roles, dataSources }) {
      return dataSources.filesAPI.getFilesInBucket({ user, roles }, bucket, prefix, recursive);
    },
    presignedPutUrl(_, { bucket, fileName }, { user, roles, dataSources }) {
      return dataSources.filesAPI.getPresignedPutUrl({ user, roles }, bucket, fileName);
    },
  },
  Mutation: {
    files: () => ({}),
  },
  FileMutations: {
    remove(_, { bucket, fileNames }, { user, roles, dataSources }) {
      return dataSources.filesAPI.removeObjects({ user, roles }, bucket, fileNames);
    },
    move(_, { bucket, fileNames, newFolder }, { user, roles, dataSources }) {
      return dataSources.filesAPI.moveObject({ user, roles }, bucket, fileNames, newFolder);
    },
    rename(_, { bucket, fileName, newFileName }, { user, roles, dataSources }) {
      return dataSources.filesAPI.renameObject({ user, roles }, bucket, fileName, newFileName);
    },
  },
};

export default fileResolvers;
