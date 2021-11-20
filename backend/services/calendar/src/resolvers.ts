import { AuthenticationError } from "apollo-server";
import { context } from "dsek-shared";
import { DataSources } from "./datasources";
import { Resolvers } from "./types/graphql";

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    event: (_, { id }, { dataSources }) => {
      return dataSources.eventAPI.getEvent(id);
    },
    events: (_, { filter }, { dataSources }) => {
      return dataSources.eventAPI.getEvents(filter);
    },
  },
  Mutation: {
    event: () => ({}),
  },
  EventMutations: {
    create: (_, { input }, { user, dataSources }) => {
      if (!user) throw new AuthenticationError("Operation denied");
      return dataSources.eventAPI.createEvent(input, user.keycloak_id);
    },
    update: (_, { id, input }, { user, dataSources }) => {
      if (!user) throw new AuthenticationError("Operation denied");
      return dataSources.eventAPI.updateEvent(id, input);
    },
    remove: (_, { id }, { user, dataSources }) => {
      if (!user) throw new AuthenticationError("Operation denied");
      return dataSources.eventAPI.removeEvent(id);
    },
  },
};

export default resolvers;
