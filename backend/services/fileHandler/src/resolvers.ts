import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    bucket: (_, { name, prefix }, { dataSources }) => {
      return dataSources.documentsAPI.getFilesInBucket(name, prefix);
    },
    presignedPutDocumentUrl: (_, { fileName }, { dataSources }) => {
      return dataSources.documentsAPI.getPresignedPutUrl(fileName);
    },
  },
  Mutation: {
    document: () => ({}),
  },
  DocumentsFileMutations: {
    remove: async (_, { fileNames }, { dataSources }) => {
      return await dataSources.documentsAPI.removeObjects(fileNames);
    },
    move: (_, { fileNames, newFolder }, { dataSources }) => {
      console.log("moving", fileNames, newFolder);
      return dataSources.documentsAPI.moveObject(fileNames, newFolder);
    },
    rename: (_, { fileName, newFileName }, { dataSources }) => {
      return dataSources.documentsAPI.renameObject(fileName, newFileName);
    },
  }
};

export default resolvers;