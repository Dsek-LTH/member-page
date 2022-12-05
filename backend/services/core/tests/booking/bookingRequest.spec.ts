import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from '~/src/shared';
import BookingRequestAPI, { convertBookable } from '~/src/datasources/BookingRequest';
import { bookableCategory, createBookables, createBookingRequests } from './data';
import * as gql from '~/src/types/graphql';
import * as sql from '~/src/types/booking';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const bookingRequestAPI = new BookingRequestAPI(knex);

let bookables: sql.Bookable[];
let bookingRequests: sql.BookingRequest[];

const insertBookingRequests = async () => {
  bookables = (await knex('bookables').insert(createBookables).returning('*'));
  bookingRequests = await knex('booking_requests').insert(createBookingRequests).returning('*');
  await knex('booking_bookables').insert([
    { booking_request_id: bookingRequests[0].id, bookable_id: bookables[0].id },
    { booking_request_id: bookingRequests[1].id, bookable_id: bookables[0].id },
    { booking_request_id: bookingRequests[2].id, bookable_id: bookables[0].id },
    { booking_request_id: bookingRequests[3].id, bookable_id: bookables[0].id },
  ]);
};

const convertBookingRequest = (br: sql.BookingRequest): gql.BookingRequest => {
  const {
    booker_id: bookerId, status, ...rest
  } = br;
  return {
    ...rest,
    booker: {
      id: bookerId,
    },
    status: status as gql.BookingStatus,
    what: bookables.map(convertBookable),
  };
};

describe('[bookingRequest]', () => {
  beforeEach(() => {
    sandbox.on(bookingRequestAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('booking_bookables').del();
    await knex('booking_requests').del();
    await knex('bookables').del();
    await knex('bookable_categories').del();
    sandbox.restore();
  });

  describe('[getBookingRequest]', () => {
    it('returns a single request', async () => {
      await insertBookingRequests();
      const res = await bookingRequestAPI.getBookingRequest({}, bookingRequests[0].id);
      expect(res).to.deep.equal(convertBookingRequest(bookingRequests[0]));
    });

    it('returns undefined on missing id', async () => {
      const res = await bookingRequestAPI.getBookingRequest({}, '30b4eac9-8ad7-4dce-b1b1-4954530a6e1c');
      expect(res).to.deep.equal(undefined);
    });
  });

  describe('[getBookingRequests]', () => {
    it('returns all requests', async () => {
      await insertBookingRequests();
      const res = await bookingRequestAPI.getBookingRequests({});
      expect(res).to.deep.equal(bookingRequests.map(convertBookingRequest));
    });

    it('returns requests with status', async () => {
      await insertBookingRequests();
      const status = gql.BookingStatus.Pending;
      const res = await bookingRequestAPI.getBookingRequests({}, { status });
      expect(res).to.deep.equal(bookingRequests.slice(0, 2).map(convertBookingRequest));
    });

    it('returns requests with start after date', async () => {
      await insertBookingRequests();
      const from = new Date('2021-04-23 17:00:00');
      const res = await bookingRequestAPI.getBookingRequests({}, { from });
      expect(res).to.deep.equal(bookingRequests.slice(1).map(convertBookingRequest));
    });

    it('returns requests with start before date', async () => {
      await insertBookingRequests();
      const to = new Date('2021-04-24 10:00:00');
      const res = await bookingRequestAPI.getBookingRequests({}, { to });
      expect(res).to.deep.equal(bookingRequests.slice(0, 2).map(convertBookingRequest));
    });

    it('returns requests with start between two dates', async () => {
      await insertBookingRequests();
      const from = new Date('2021-04-23 10:00:00');
      const to = new Date('2021-04-25 10:00:00');
      const res = await bookingRequestAPI.getBookingRequests({}, { to, from });
      expect(res).to.deep.equal(bookingRequests.slice(1, 3).map(convertBookingRequest));
    });

    it('returns requests with start between two dates and status', async () => {
      await insertBookingRequests();
      const from = new Date('2021-04-23 10:00:00');
      const to = new Date('2021-04-25 10:00:00');
      const status = gql.BookingStatus.Pending;
      const res = await bookingRequestAPI.getBookingRequests({}, { to, from, status });
      expect(res).to.deep.equal(bookingRequests.slice(1, 2).map(convertBookingRequest));
    });
  });

  describe('[createBookingRequest]', () => {
    const input: gql.CreateBookingRequest = {
      start: '2021-04-22T20:00:00Z',
      end: '2021-04-22T21:00:00Z',
      what: [],
      event: 'Sittning',
      booker_id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
    };

    it('creates a request', async () => {
      await insertBookingRequests();
      const body = { ...input, what: [bookables[0].id] };
      const res = await bookingRequestAPI.createBookingRequest({}, body);
      if (!res) expect.fail();
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        created, id, status, ...rest
      } = res;
      expect(status).to.equal(gql.BookingStatus.Pending);
      expect(rest).to.deep.equal({
        start: new Date(input.start),
        end: new Date(input.end),
        what: [convertBookable(bookables[0])],
        event: input.event,
        booker: {
          id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
        },
      });
    });
  });

  describe('[updateBookingRequest]', () => {
    const input: gql.UpdateBookingRequest = {
      start: '2021-04-22T20:00:00Z',
      end: '2021-04-22T21:00:00Z',
      what: [],
      event: 'new',
    };

    it('updates a request', async () => {
      await insertBookingRequests();
      const res = await bookingRequestAPI.updateBookingRequest({}, bookingRequests[0].id, input);
      if (!res) expect.fail();
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        created, id, status, ...rest
      } = res;
      expect(rest).to.deep.equal({
        start: new Date(input.start),
        end: new Date(input.end),
        what: [convertBookable(bookables[0])],
        event: input.event,
        booker: {
          id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
        },
      });
    });
  });

  describe('[removeBookingRequest]', () => {
    it('removes a request', async () => {
      await insertBookingRequests();
      const res = await bookingRequestAPI.removeBookingRequest({}, bookingRequests[0].id);
      const request = await bookingRequestAPI.getBookingRequest({}, bookingRequests[0].id);
      expect(res).to.deep.equal(convertBookingRequest(bookingRequests[0]));
      expect(request).to.be.undefined;
    });
  });

  describe('[updateStatus]', () => {
    it('updates the status of a request', async () => {
      await insertBookingRequests();
      const status = gql.BookingStatus.Denied;
      await bookingRequestAPI.updateStatus({}, bookingRequests[1].id, status);
      const request = await bookingRequestAPI.getBookingRequest({}, bookingRequests[1].id);
      expect(request?.status).to.equal(status);
    });
  });

  describe('getBookableCategory', () => {
    it('returns a bookable category by ID', async () => {
      await knex('bookable_categories').insert(bookableCategory);
      const res = await bookingRequestAPI.getBookableCategory({}, bookableCategory[0].id);
      expect(res).to.deep.equal(bookableCategory[0]);
    });
  });
});
