import 'mocha';
import chai, { expect, assert } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { BookingRequest } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_BOOKING_REQUESTS_ARGS = gql`
query getBookingRequests($id: Int, $from: Datetime, $to: Datetime, $status: BookingStatus) {
  positions(filter: {id: $id, from: $from, to: $to, status: $status}) {
    id
    start
    end
    event
    booker {
      first_name
      last_name
    }
    what
    status
    created
    last_modified
  }
}
`
const GET_BOOKING_REQUESTS = gql`
query {
  positions {
    id
    start
    end
    event
    booker {
      first_name
      last_name
    }
    what
    status
    created
    last_modified
  }
}
`

//TODO: Create dummy data and tests
const bookingRequests: BookingRequest[] = [

]

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
  })

  beforeEach(() => {
    sandbox.on(dataSources.bookingRequestAPI, 'someFunction', (filter) => {
      return new Promise(resolve => resolve(undefined))
    })
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[bookingRequests]', () => {

    it('does something', async () => {
      const { data } = await client.query({query: GET_BOOKING_REQUESTS});
      expect(data).to.deep.equal(undefined);
    })
  })
})