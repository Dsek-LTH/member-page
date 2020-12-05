import { context } from 'dsek-shared';
import { Resolvers } from './types/graphql';
import * as gql from './types/graphql';
import * as sql from './types/mysql';
import { DbBookingRequest } from './types/mysql';
import { DataSources } from './datasources';


interface DataSourceContext {
  dataSources: DataSources
}

//TODO: define methods in datasources/BookingRequests and use them in the resolvers

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    bookingRequests: (_, {filter}, {dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequests(filter)
    }
  },
  BookingRequest: {
    __resolveReference: (BookingRequest, {dataSources}) => {
      return dataSources.bookingRequestAPI.getBookingRequest(BookingRequest)
    },
    booker: (bookingRequest: gql.BookingRequest) => {
      return {typename: "Member", id: bookingRequest.booker.id}
    }
  },
  Mutation: {
    bookingRequests: () => ({}),
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
    create: (_, {input}, {user, roles, dataSources}) => {        //create understruket
      return dataSources.bookingRequestAPI.createBookingRequest({user, roles}, input) //input understruket
        .then((res) => (res) ? res[0] : -1);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.updateBookingRequest({user, roles}, id, input) //input understruket
        .then((res) => (res) ? true : false);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.bookingRequestAPI.removeBookingRequest({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
}

export default resolvers;