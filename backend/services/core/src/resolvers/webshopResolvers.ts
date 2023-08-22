import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const webshopResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    products: (_parent, { categoryId }, { user, roles, dataSources }) => dataSources
      .webshopAPI.getProducts({ user, roles }, categoryId),
    product: async (_parent, { id }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getProductById({ user, roles }, id),
    productCategories: (_parent, _args, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getProductCategories({ user, roles }),
    myCart: (_parent, _args, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getMyCart({ user, roles }),
    payment: (_parent, { id }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getPayment({ user, roles }, id),
    chest: (_parent, { studentId }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getUserInventory({ user, roles }, studentId),
    productQuestions: (_parent, { productId }, {user, roles, dataSources}) => 
      dataSources.webshopAPI.getQuestionsByProduct({user, roles}, productId)
  },
  Mutation: {
    webshop: () => ({}),
  },
  WebshopMutations: {
    addToMyCart: async (_parent, { inventoryId, quantity }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.addToMyCart({ user, roles }, inventoryId, quantity),
    removeFromMyCart: async (_parent, { inventoryId, quantity }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.removeFromMyCart({ user, roles }, inventoryId, quantity),
    removeMyCart: async (_parent, _args, { user, roles, dataSources }) =>
      dataSources.webshopAPI.removeMyCart({ user, roles }),
    createProduct: async (_, { input }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.createProduct({ user, roles }, input),
    initiatePayment: async (_, { phoneNumber }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.initiatePayment({ user, roles }, phoneNumber),
    freeCheckout: async (_, __, { user, roles, dataSources }) =>
      dataSources.webshopAPI.initiatePayment({ user, roles }),
    updatePaymentStatus: async (_, { paymentId, status }, { dataSources }) =>
      dataSources.webshopAPI.updatePaymentStatus(paymentId, status),
    consumeItem: async (_, { itemId }, { user, roles, dataSources }) =>
      dataSources.webshopAPI.consumeItem({ user, roles }, itemId),
  },
  Cart: {
    cartItems: async (cart, _args, { user, roles, dataSources }) =>
      dataSources.webshopAPI.getCartsItemInMyCart({ user, roles }, cart),
  },

};

export default webshopResolvers;
