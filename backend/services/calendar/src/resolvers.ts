import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event(_, { id }, { dataSources, ...ctx }) {
      return dataSources.eventAPI.getEvent(ctx, id);
    },
    events(_, { page, perPage, filter }, { dataSources, ...ctx }) {
      return dataSources.eventAPI.getEvents(ctx, page, perPage, filter);
    },
  },
  Mutation: {
    event: () => ({}),
  },
  EventMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.eventAPI.createEvent(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.eventAPI.updateEvent(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.eventAPI.removeEvent(ctx, id);
    },
  },
};

export default resolvers;
