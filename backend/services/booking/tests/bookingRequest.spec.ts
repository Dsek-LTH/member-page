import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import BookingRequestAPI from '../src/datasources/BookingRequest';
import { dbBookingRequests, bookingRequests } from './data';
import { BookingStatus, CreateBookingRequest, UpdateBookingRequest } from '../src/types/graphql';
import { ForbiddenError } from 'apollo-server-errors';

const tracker = mockDb.getTracker();
const bookingRequestAPI = new BookingRequestAPI(knex);

const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 'test2',
  },
  roles: ['dsek']
}

describe('[bookingRequest]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())

  describe('[getBookingRequest]', () => {

    it('returns a single request', async () => {
      const id = 4;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.bindings).to.include(id);
        query.response([dbBookingRequests[0]]);
      })
      const res = await bookingRequestAPI.getBookingRequest(id);
      expect(res).to.deep.equal(bookingRequests[0]);
    })

    it('returns undefined on missing id', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        query.response([]);
      })
      const res = await bookingRequestAPI.getBookingRequest(-1);
      expect(res).to.deep.equal(undefined);
    })
  })

  describe('[getBookingRequests]', () => {

    it('returns all requests', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.bindings).to.have.length(0);
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests();
      expect(res).to.deep.equal(bookingRequests);
    })

    it('returns requests with status', async () => {
      const status = BookingStatus.Pending;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.bindings).to.include(status);
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests({status});
      expect(res).to.deep.equal(bookingRequests);
    })

    it('returns requests with start after date', async () => {
      const from = new Date("2021-04-22 10:00:00");
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.sql).to.include('>');
        expect(query.bindings).to.include(from);
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests({from});
      expect(res).to.deep.equal(bookingRequests);
    })

    it('returns requests with start before date', async () => {
      const to = new Date("2021-04-24 10:00:00");
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.sql).to.include('<');
        expect(query.bindings).to.include(to);
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests({to});
      expect(res).to.deep.equal(bookingRequests);
    })

    it('returns requests with start between two dates', async () => {
      const from = new Date("2021-04-22 10:00:00");
      const to = new Date("2021-04-24 10:00:00");
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.sql).to.include('between');
        [from, to].forEach(x => expect(query.bindings).to.include(x));
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests({to, from});
      expect(res).to.deep.equal(bookingRequests);
    })

    it('returns requests with start between two dates and status', async () => {
      const from = new Date("2021-04-22 10:00:00");
      const to = new Date("2021-04-24 10:00:00");
      const status = BookingStatus.Pending;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select');
        expect(query.sql).to.include('between');
        [from, to, status].forEach(x => expect(query.bindings).to.include(x));
        query.response(dbBookingRequests);
      })
      const res = await bookingRequestAPI.getBookingRequests({to, from, status});
      expect(res).to.deep.equal(bookingRequests);
    })

  })

  describe('[createBookingRequest]', () => {

    const input: CreateBookingRequest = {
      start: new Date('2021-04-22 20:00:00'),
      end: new Date('2021-04-22 21:00:00'),
      what: 'iDét',
      event: 'Sittning',
      booker_id: 1,
    }

    it('denies access to signed out users', async () => {
      expect(
        () => bookingRequestAPI.createBookingRequest(undefined, input)
      ).to.throw(ForbiddenError)
    })

    it('creates a request', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('insert');
        Object.values(input).forEach(x => expect(query.bindings).to.include(x));
        query.response([1]);
      })
      await bookingRequestAPI.createBookingRequest(user, input);
    })
  })

  describe('[updateBookingRequest]', () => {

    const input: UpdateBookingRequest = {
      start: new Date('2021-04-22 20:00:00'),
      end: new Date('2021-04-22 21:00:00'),
      what: 'iDét',
      event: 'Sittning',
    }

    it('denies access to signed out users', async () => {
      expect(
        () => bookingRequestAPI.updateBookingRequest(undefined, 1, input)
      ).to.throw(ForbiddenError);
    })

    it('updates a request', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('update');
        Object.values(input).forEach(x => expect(query.bindings).to.include(x));
        query.response([1]);
      })
      await bookingRequestAPI.updateBookingRequest(user, 1, input);
    })
  })

  describe('[removeBookingRequest]', () => {

    it('denies access to signed out users', async () => {
      expect(
        () => bookingRequestAPI.removeBookingRequest(undefined, 1)
      ).to.throw(ForbiddenError);
    })

    it('removes a request', async () => {
      const id = 3;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('del');
        expect(query.bindings).to.include(id);
        query.response(1);
      })
      await bookingRequestAPI.removeBookingRequest(user, id);
    })
  })

  describe('[updateStatus]', () => {

    it('denies access to signed out users', async () => {
      expect(
        () => bookingRequestAPI.updateStatus(undefined, 1, BookingStatus.Accepted)
      ).to.throw(ForbiddenError);
    })

    it('updates the status of a request', async () => {
      const status = BookingStatus.Denied;
      const id = 5;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('update');
        expect(query.bindings).to.include(status);
        expect(query.bindings).to.include(id);
        query.response(1);
      })
      await bookingRequestAPI.updateStatus(user, id, status);
    })
  })
})