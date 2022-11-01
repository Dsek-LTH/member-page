import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { BookingFilter, BookingRequest, BookingStatus } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import constructTestServer from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_BOOKING_REQUESTS_ARGS = gql`
query getBookingRequests($from: Datetime, $to: Datetime, $status: BookingStatus) {
  bookingRequests(filter: {from: $from, to: $to, status: $status}) {
    id
    start
    end
    event
    booker {
      id
    }
    what {
      id
      isDisabled
      name
      name_en
    }
    status
    created
    last_modified
  }
}
`;
const GET_BOOKING_REQUESTS = gql`
query {
  bookingRequests {
    id
    start
    end
    event
    booker {
      id
    }
    what {
      id
      isDisabled
      name
      name_en
    }
    status
    created
    last_modified
  }
}
`;
const bookingRequests: BookingRequest[] = [
  {
    id: 1,
    start: new Date(),
    end: new Date(),
    event: 'Test',
    booker: { id: 3 },
    what: [{
      id: '12323-dfvfsd-21323',
      name: 'iDét',
      name_en: 'iDét_en',
      isDisabled: false,
    }],
    status: BookingStatus.Accepted,
    created: new Date(),
    last_modified: null,
  },
  {
    id: 2,
    start: new Date(),
    end: new Date(),
    event: 'Test2',
    booker: { id: 4 },
    what: [{
      id: '12323-dfvfsd-21323',
      name: 'iDét',
      name_en: 'iDét_en',
      isDisabled: false,
    }],
    status: BookingStatus.Denied,
    created: new Date(),
    last_modified: new Date(),
  },
];

const filter: BookingFilter = {
  from: new Date(),
  to: new Date(),
};

describe('[Queries]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  });

  beforeEach(() => {
    sandbox.on(dataSources.bookingRequestAPI, 'getBookingRequests', () => Promise.resolve(bookingRequests));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[bookingRequests]', () => {
    it('gets all booking requests', async () => {
      const { data } = await client.query({ query: GET_BOOKING_REQUESTS });
      expect(dataSources.bookingRequestAPI.getBookingRequests).to.have.been.called.once;
      expect(data).to.deep.equal({ bookingRequests });
    });

    it('gets filtered booking requests', async () => {
      const { data } = await client.query({ query: GET_BOOKING_REQUESTS_ARGS, variables: filter });
      expect(dataSources.bookingRequestAPI.getBookingRequests).to.have.been.called.with(filter);
      expect(data).to.deep.equal({ bookingRequests });
    });
  });
});
