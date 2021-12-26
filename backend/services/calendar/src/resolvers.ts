import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event(_, { id }, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvent({ user, roles }, id);
    },
    events(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.eventAPI.getEvents({ user, roles }, page, perPage, filter);
    },
  },
  Mutation: {
    event: () => ({}),
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
  },
};

export default resolvers;
