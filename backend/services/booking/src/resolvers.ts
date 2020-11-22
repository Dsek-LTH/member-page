import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

//TODO: define methods in datasources/BookingRequests and use them in the resolvers

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    bookingRequests: (_, {filter}, {dataSources}) => {
      return [];
    }
  },
  BookingRequest: {
    __resolveReference: (BookingRequest, {dataSources}) => {
      return undefined;
    },
    booker: (parent, _, {dataSources}) => {
      return undefined
    }
  },
  Mutation: {
    bookingRequests: () => ({}),
  },
  BookingRequestMutations: {
    accept: (_, {id}, {user, roles, dataSources}) => {
      return false;
    },
    deny: (_, {id}, {user, roles, dataSources}) => {
      return false;
    },
    create: (_, {input}, {user, roles, dataSources}) => {
      return -1;
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return false;
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return false;
    }
  },
}

export default resolvers;