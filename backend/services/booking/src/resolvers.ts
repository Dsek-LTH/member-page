/* eslint-disable no-underscore-dangle */
import { context } from 'dsek-shared';
import { Resolvers } from './types/graphql';
import * as gql from './types/graphql';
import { DataSources } from './datasources';

interface DataSourceContext {
  dataSources: DataSources
}

const { Denied, Accepted } = gql.BookingStatus;

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    bookingRequest(_, { id }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.getBookingRequest(ctx, id);
    },
    bookingRequests(_, { filter }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.getBookingRequests(ctx, filter);
    },
    bookables(_, __, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.getBookables(ctx);
    },
  },
  BookingRequest: {
    __resolveReference(BookingRequest, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.getBookingRequest(ctx, BookingRequest.id);
    },
    booker(bookingRequest: gql.BookingRequest) {
      return { __typename: 'Member', id: bookingRequest.booker.id };
    },
  },
  Mutation: {
    bookingRequest: () => ({}),
  },
  BookingRequestMutations: {
    accept(_, { id }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.updateStatus(ctx, id, Accepted)
        .then((res) => !!res);
    },
    deny(_, { id }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.updateStatus(ctx, id, Denied)
        .then((res) => !!res);
    },
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.createBookingRequest(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.updateBookingRequest(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.bookingRequestAPI.removeBookingRequest(ctx, id);
    },
  },
};

export default resolvers;
