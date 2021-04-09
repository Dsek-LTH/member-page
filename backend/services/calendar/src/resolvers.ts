import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event: (_, {id}, {dataSources}) => {
      return dataSources.eventsAPI.getEvent(id);
    },
    events: (_, {filter}, {dataSources}) => {
      return dataSources.eventsAPI.getEvents(filter);
    }
  },
  Mutation: {
    event: () => ({})
  },
  EventMutations: {
    create: (_, {input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.eventsAPI.createEvent(input.title, input.description, input.start_datetime, input.end_datetime, input.link);
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.eventsAPI.updateEvent(id, input.title, input.description, input.link, input.start_datetime, input.end_datetime);
    },
    remove: (_, {id}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.eventsAPI.removeEvent(id);
    },
  },
};

export default resolvers;