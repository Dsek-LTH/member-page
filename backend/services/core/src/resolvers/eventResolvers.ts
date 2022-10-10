import { context } from 'dsek-shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const eventResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvent({ user, roles }, id);
    },
    events(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvents(
        { user, roles },
        page,
        perPage,
        filter,
      );
    },
  },
  Mutation: {
    event: () => ({}),
  },
  Event: {
    __resolveReference(event, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvent({ user, roles }, event.id);
    },
    likes(event, _, { dataSources }) {
      return dataSources.eventAPI.getLikes(event.id);
    },
    isLikedByMe(event, _, { user, dataSources }) {
      return dataSources.eventAPI.isLikedByUser(
        event.id,
        user?.keycloak_id,
      );
    },
  },
  EventMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.eventAPI.createEvent({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.eventAPI.updateEvent({ user, roles }, id, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.removeEvent({ user, roles }, id);
    },
    like(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.likeEvent({ user, roles }, id);
    },
    unlike(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.unlikeEvent({ user, roles }, id);
    },
  },
};

export default eventResolvers;
