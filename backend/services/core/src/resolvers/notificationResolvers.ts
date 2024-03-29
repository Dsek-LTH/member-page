import { DataSources } from '../datasources';
import { context } from '../shared';
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
    myTagSubscriptions(_, __, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.getSubscribedTags({ user, roles });
    },
    mySubscriptionSettings(_, __, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.getSubscriptionSettings({ user, roles });
    },
    getSubscriptionTypes(_, __, { dataSources }) {
      return dataSources.notificationsAPI.getSubscriptionTypes();
    },
  },
  Mutation: {
    token: () => ({}),
    tagSubscriptions: () => ({}),
    markAsRead: (_, { ids }, { user, roles, dataSources }) =>
      dataSources.notificationsAPI.markAsRead({ user, roles }, ids),
    deleteNotification: (_, { id }, { user, roles, dataSources }) =>
      dataSources.notificationsAPI.deleteNotifications({ user, roles }, [id]),
    deleteNotifications: (_, { ids }, { user, roles, dataSources }) =>
      dataSources.notificationsAPI.deleteNotifications({ user, roles }, ids),
    subscriptionSettings: () => ({}),
  },
  Token: {
    __resolveReference({ id }, { dataSources }) {
      return dataSources.notificationsAPI.getToken(id);
    },
  },
  TokenMutations: {
    register(_, { expo_token }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.registerToken({ user, roles }, expo_token);
    },
  },
  TagSubscriptionsMutations: {
    subscribe(_, { tagIds }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.subscribeTags({ user, roles }, tagIds);
    },
    unsubscribe(_, { tagIds }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.unsubscribeTags({ user, roles }, tagIds);
    },
  },
  SubscriptionSettingsMutations: {
    update(_, { type, enabled, pushNotification }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.updateSubscriptionSettings(
        { user, roles },
        type,
        enabled,
        pushNotification,
      );
    },

  },
};

export default notificationResolvers;
