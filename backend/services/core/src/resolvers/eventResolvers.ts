import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const eventResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event(_, { id, slug }, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvent({ user, roles }, id, slug);
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
    iAmComing(event, _, { user, dataSources }) {
      return dataSources.eventAPI.userIsComing(
        event.id,
        user?.keycloak_id,
      );
    },
    iAmInterested(event, _, { user, dataSources }) {
      return dataSources.eventAPI.userIsInterested(
        event.id,
        user?.keycloak_id,
      );
    },
    peopleComing(event, _, { dataSources }) {
      return dataSources.eventAPI.getPeopleComing(
        event.id,
      );
    },
    peopleInterested(event, _, { dataSources }) {
      return dataSources.eventAPI.getPeopleComing(
        event.id,
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
    setComing(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.setComing({ user, roles }, id);
    },
    unsetComing(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.unsetComing({ user, roles }, id);
    },
    setInterested(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.setInterested({ user, roles }, id);
    },
    unsetInterested(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.unsetInterested({ user, roles }, id);
    },
  },
};

export default eventResolvers;
