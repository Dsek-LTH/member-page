import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';
import { BookingRequest, BookingStatus } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const CREATE_BOOKING_REQUEST = gql`
mutation createBookingRequest {
  bookingRequest {
    create(input: {
      start: "2021-12-31T18:00:00.000Z",
      end: "2022-01-01T04:00:00.000Z",
      what: "iDét",
      event: "Nyår!",
      booker_id: 1
    }) {
      id
    }
  }
}
`
const UPDATE_BOOKING_REQUEST = gql`
mutation updateBookingRequest {
  bookingRequest {
    update(id: 1, input: {what: "Shäraton"}) {
      id
    }
  }
}
`
const REMOVE_BOOKING_REQUEST = gql`
mutation removeBookingRequest {
  bookingRequest {
    remove(id: 1) {
      id
    }
  }
}
`
const ACCEPT_BOOKING_REQUEST = gql`
mutation acceptBookingRequest {
  bookingRequest {
    accept(id: 1)
  }
}
`
const DENY_BOOKING_REQUEST = gql`
mutation denyBookingRequest {
  bookingRequest {
    deny(id: 1)
  }
}
`

const br: BookingRequest = {
  start: new Date('2021-04-22 20:00:00'),
  end: new Date('2021-04-22 21:00:00'),
  what: 'iDét',
  event: 'Sittning',
  booker: {
    id: 1,
  },
  created: new Date(),
  status: BookingStatus.Pending,
  id: 4,
}

describe('[Mutations]', () => {
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
    sandbox.on(dataSources.bookingRequestAPI, 'createBookingRequest', (ctx, input) => new Promise(resolve => resolve(br)))
    sandbox.on(dataSources.bookingRequestAPI, 'updateBookingRequest', (ctx, id, input) => new Promise(resolve => resolve(br)))
    sandbox.on(dataSources.bookingRequestAPI, 'removeBookingRequest', (ctx, id) => new Promise(resolve => resolve(br)))
    sandbox.on(dataSources.bookingRequestAPI, 'updateStatus', (ctx, input) => new Promise(resolve => resolve(true)))
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[bookingRequest]', () => {

    it('creates a booking request', async () => {
      const { data } = await client.mutate({mutation: CREATE_BOOKING_REQUEST});
      expect(dataSources.bookingRequestAPI.createBookingRequest).to.have.been.called.with({
        start: "2021-12-31T18:00:00.000Z",
        end: "2022-01-01T04:00:00.000Z",
        what: "iDét",
        event: "Nyår!",
        booker_id: 1
      })
      expect(data.bookingRequest.create).to.deep.equal({id: br.id});
    })

    it('updates a booking request', async () => {
      const { data } = await client.mutate({mutation: UPDATE_BOOKING_REQUEST});
      expect(dataSources.bookingRequestAPI.updateBookingRequest).to.have.been.called.with(1)
      expect(dataSources.bookingRequestAPI.updateBookingRequest).to.have.been.called.with({what: 'Shäraton'});
      expect(data.bookingRequest.update).to.deep.equal({id: br.id});
    })

    it('removes a booking request', async () => {
      const { data } = await client.mutate({mutation: REMOVE_BOOKING_REQUEST});
      expect(dataSources.bookingRequestAPI.removeBookingRequest).to.have.been.called.with(1);
      expect(data.bookingRequest.remove).to.deep.equal({id: br.id});
    })

    it('accepts a booking request', async () => {
      const { data } = await client.mutate({mutation: ACCEPT_BOOKING_REQUEST});
      expect(dataSources.bookingRequestAPI.updateStatus).to.have.been.called.with(1)
      expect(dataSources.bookingRequestAPI.updateStatus).to.have.been.called.with(BookingStatus.Accepted)
      expect(data.bookingRequest.accept).to.be.true;
    })

    it('denies a booking request', async () => {
      const { data } = await client.mutate({mutation: DENY_BOOKING_REQUEST});
      expect(dataSources.bookingRequestAPI.updateStatus).to.have.been.called.with(1)
      expect(dataSources.bookingRequestAPI.updateStatus).to.have.been.called.with(BookingStatus.Denied)
      expect(data.bookingRequest.deny).to.be.true;
    })
  })
})