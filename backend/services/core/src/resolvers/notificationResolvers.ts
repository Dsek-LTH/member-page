import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const notificationResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    token(_, { expo_token }, { dataSources }) {
      return dataSources.notificationsAPI.getToken(expo_token);
    },
    myNotifications(_, __, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.getMyNotifications({ user, roles });
    },
  },
  Mutation: {
    token: () => ({}),
  },
  Token: {
    __resolveReference({ id }, { dataSources }) {
      return dataSources.notificationsAPI.getToken(id);
    },
    tagSubscriptions({ id }, _, { dataSources }) {
      return dataSources.notificationsAPI.getSubscribedTags(id);
    },
  },
  TokenMutations: {
    register(_, { expo_token }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.registerToken({ user, roles }, expo_token);
    },
    subscribe(_, { expo_token, tagIds }, { dataSources }) {
      return dataSources.notificationsAPI.subscribeTags(expo_token, tagIds);
    },
    unsubscribe(_, { expo_token, tagIds }, { dataSources }) {
      return dataSources.notificationsAPI.unsubscribeTags(expo_token, tagIds);
    },
  },
};

export default notificationResolvers;
