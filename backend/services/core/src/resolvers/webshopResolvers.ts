import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const webshopResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    products: (_parent, { categoryId }, { user, roles, dataSources }) => dataSources
      .productAPI.getProducts({ user, roles }, categoryId),
    product: async (_parent, { id }, { user, roles, dataSources }) =>
      dataSources.productAPI.getProductById({ user, roles }, id),
    productCategories: (_parent, _args, { user, roles, dataSources }) =>
      dataSources.productAPI.getProductCategories({ user, roles }),
    myCart: (_parent, _args, { user, roles, dataSources }) =>
      dataSources.cartAPI.getMyCart({ user, roles }),
    payment: (_parent, { id }, { user, roles, dataSources }) =>
      dataSources.paymentAPI.getPayment({ user, roles }, id),
    chest: (_parent, { studentId }, { user, roles, dataSources }) =>
      dataSources.inventoryAPI.getUserInventory({ user, roles }, studentId),
  },
  Mutation: {
    webshop: () => ({}),
  },
  WebshopMutations: {
    addToMyCart: async (_parent, { inventoryId, quantity }, { user, roles, dataSources }) =>
      dataSources.cartAPI.addToMyCart({ user, roles }, inventoryId, quantity),
    removeFromMyCart: async (_parent, { inventoryId, quantity }, { user, roles, dataSources }) =>
      dataSources.cartAPI.removeFromMyCart({ user, roles }, inventoryId, quantity),
    removeMyCart: async (_parent, _args, { user, roles, dataSources }) =>
      dataSources.cartAPI.removeMyCart({ user, roles }),
    createProduct: async (_, { input }, { user, roles, dataSources }) =>
      dataSources.productAPI.createProduct({ user, roles }, input),
    initiatePayment: async (_, { phoneNumber }, { user, roles, dataSources }) =>
      dataSources.paymentAPI.initiatePayment({ user, roles }, phoneNumber),
    updatePaymentStatus: async (_, { paymentId, status }, { dataSources }) =>
      dataSources.paymentAPI.updatePaymentStatus(paymentId, status),
    consumeItem: async (_, { itemId }, { user, roles, dataSources }) =>
      dataSources.inventoryAPI.consumeItem({ user, roles }, itemId),
  },
  Cart: {
    cartItems: async (cart, _args, { user, roles, dataSources }) =>
      dataSources.cartAPI.getCartsItemInMyCart({ user, roles }, cart),
  },

};

export default webshopResolvers;
