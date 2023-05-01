import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const governingDocumentResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
  },
  Mutation: {
    governingDocument: () => ({}),
  },
  GoverningDocumentMutations: {
    create: async (_, { input }, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.createGoverningDocument({ user, roles }, input),
  },
};

export default governingDocumentResolvers;
