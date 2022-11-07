/* eslint-disable no-underscore-dangle */
import { context } from '../shared';
import { Resolvers } from '../types/graphql';
import * as gql from '../types/graphql';
import { DataSources } from '../datasources';

interface DataSourceContext {
  dataSources: DataSources
}

const { Denied, Accepted } = gql.BookingStatus;

const bookingResolvers: Resolvers<context.UserContext & DataSourceContext> = {
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
    async booker(parent, __, { user, roles, dataSources }) {
      const member = await dataSources
        .memberAPI.getMember({ user, roles }, { id: parent.booker.id });
      return member!;
    },
  },
  Mutation: {
    bookingRequest: () => ({}),
    bookable: () => ({}),
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
  Bookable: {
    __resolveReference(Bookable, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookable({ user, roles }, Bookable.id);
    },
    category(Bookable, __, { user, roles, dataSources }) {
      return dataSources.bookingRequestAPI.getBookableCategory(
        { user, roles },
        Bookable.category?.id,
      );
    },
  },
};

export default bookingResolvers;
