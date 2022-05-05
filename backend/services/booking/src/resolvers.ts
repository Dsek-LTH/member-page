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
    bookingRequest(_, { id }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookingRequest({ user, roles }, id);
    },
    bookingRequests(_, { filter }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookingRequests({ user, roles }, filter);
    },
    bookables(_, { includeDisabled }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookables({ user, roles }, includeDisabled);
    },
  },
  BookingRequest: {
    __resolveReference(BookingRequest, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookingRequest({ user, roles }, BookingRequest.id);
    },
    booker(bookingRequest: gql.BookingRequest) {
      return { __typename: 'Member', id: bookingRequest.booker.id };
    },
  },
  Mutation: {
    bookingRequest: () => ({}),
  },
  BookableMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.createBookable({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.updateBookable({ user, roles }, id, input);
    },
  },
  BookingRequestMutations: {
    accept(_, { id }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.updateStatus({ user, roles }, id, Accepted)
        .then((res) => !!res);
    },
    deny(_, { id }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.updateStatus({ user, roles }, id, Denied)
        .then((res) => !!res);
    },
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.createBookingRequest({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.updateBookingRequest({ user, roles }, id, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.removeBookingRequest({ user, roles }, id);
    },
  },
};

export default resolvers;
