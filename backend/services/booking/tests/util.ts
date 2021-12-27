import { knex } from 'dsek-shared';

import { ApolloServer } from 'apollo-server';
import createApolloServer from '../src/server';

import { DataSources } from '../src/datasources';
import BookingRequestAPI from '../src/datasources/BookingRequest';

type TestServerReturn = {server: ApolloServer, context: any, dataSources: DataSources}

export default (context?: any): TestServerReturn => {
  const dataSources: DataSources = {
    bookingRequestAPI: new BookingRequestAPI(knex),
  };
  return {
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  };
};
