import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const governingDocumentResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    governingDocument: async (_, { id }, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.getGoverningDocument({ user, roles }, id),
    governingDocuments: async (_, __, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.getGoverningDocuments({ user, roles }),
    policies: async (_, __, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.getPolicies({ user, roles }),
    guidelines: async (_, __, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.getGuidelines({ user, roles }),
  },
  Mutation: {
    governingDocument: () => ({}),
  },
  GoverningDocumentMutations: {
    create: async (_, { input }, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.createGoverningDocument({ user, roles }, input),
    update: async (_, { input }, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.updateGoverningDocument({ user, roles }, input),
    delete: async (_, { id }, { dataSources, user, roles }) =>
      dataSources.governingDocumentsAPI.deleteGoverningDocument({ user, roles }, id),
  },
};

export default governingDocumentResolvers;
