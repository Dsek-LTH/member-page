import { context } from 'dsek-shared';
import { Resolvers } from './types/graphql';
import * as gql from './types/graphql';
import { DataSources } from './datasources';


interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    bookingRequest: (_, {id}, {dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequest(id);
    },
    bookingRequests: (_, {filter}, {dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequests(filter);
    },
  },
  BookingRequest: {
    __resolveReference: (BookingRequest, {dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequest(BookingRequest.id)
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
      return dataSources.bookingRequestAPI.createBookingRequest({user, roles}, input)
        .then((res) => (res) ? res[0] : -1);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.updateBookingRequest({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.removeBookingRequest({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
}

export default resolvers;