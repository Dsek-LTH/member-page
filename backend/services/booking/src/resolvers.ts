import { context } from 'dsek-shared';
import datasources, { DataSources } from './datasources';
import { Resolvers } from './types/graphql';
import BookingRequestAPI from './datasources/BookingRequest';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

interface DataSourceContext {
  dataSources: DataSources
}

//TODO: define methods in datasources/BookingRequests and use them in the resolvers

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    bookingRequests: (_, {filter}, {dataSources}) => {
      return dataSources.BookingRequestAPI.getBookingRequests({filter});
    }
  },
  BookingRequest: {
    __resolveReference: (BookingRequest, {dataSources}) => {
      return dataSources.BookingRequestAPI.getBookingRequest(BookingRequest)
    },
    booker: (parent, _, {dataSources}) => {
      return undefined; //?? member_id?
    }
  },
  Mutation: {
    bookingRequests: () => ({}),
  },
  BookingRequestMutations: {
    accept: (_, {id}, {user, roles, dataSources}) => {
      const mutation : gql.BookingRequest = {
        status: gql.BookingStatus.Accepted
      }
      return dataSources.BookingRequestAPI.updateBookingRequest(user, id, sql.DbUpdate(mutation)) //oklart
    },
    deny: (_, {id}, {user, roles, dataSources}) => {
      const mutation : gql.BookingRequest = {
        status: gql.BookingStatus.Denied
      }
      return dataSources.BookingRequestAPI.updateBookingRequest({user, roles}, id, sql.DbUpdate(mutation)) //oklart
    },
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.BookingRequestAPI.createBookingRequest({user, roles}, input)
      .then((res) => (res) ? true : false);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.BookingRequestAPI.updateBookingRequest({user, roles}, id, input)
      .then((res) => (res) ? true : false);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.BookingRequestAPI.removeBookingRequest({user, roles}, id)
      .then((res) => (res) ? true : false);
    }
  },
}

export default resolvers;