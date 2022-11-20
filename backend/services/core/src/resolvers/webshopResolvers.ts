import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const webshopResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    products: (_parent, _args, { user, roles, dataSources }) => {
      console.log('products');
      return dataSources.webshopAPI.getProducts({ user, roles });
    },
    product: async (_parent, { id }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getProductById({ user, roles }, id),
  },
  Mutation: {
    addToMyCart: async (_parent, { inventoryId, quantity }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.addToMyCart({ user, roles }, inventoryId, quantity),
    removeFromMyCart: async (_parent, { inventoryId }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.removeFromMyCart({ user, roles }, inventoryId),
    createProduct: async (_, { input }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.createProduct({ user, roles }, input),
  },

};

export default webshopResolvers;
