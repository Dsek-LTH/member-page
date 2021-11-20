import { context } from 'dsek-shared';
import { Resolvers } from './types/graphql';
import * as gql from './types/graphql';
import { DataSources } from './datasources';


interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    bookingRequest: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequest({user, roles}, id);
    },
    bookingRequests: (_, {filter}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequests({user, roles}, filter);
    },
  },
  BookingRequest: {
    __resolveReference: (BookingRequest, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequest({user, roles}, BookingRequest.id)
    },
    booker: (bookingRequest: gql.BookingRequest) => {
      return {__typename: "Member", id: bookingRequest.booker.id}
    }
  },
  Mutation: {
    bookingRequest: () => ({}),
  },
  BookingRequestMutations: {
    accept: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.updateStatus({user, roles}, id, gql.BookingStatus.Accepted)
        .then((res) => (res) ? true : false);
    },
    deny: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.updateStatus({user, roles}, id, gql.BookingStatus.Denied)
        .then((res) => (res) ? true : false);
    },
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.createBookingRequest({user, roles}, input);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.updateBookingRequest({user, roles}, id, input);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.removeBookingRequest({user, roles}, id);
    }
  },
}

export default resolvers;