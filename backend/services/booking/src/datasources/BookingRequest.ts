import { dbUtils, context, UUID } from 'dsek-shared';

import * as gql from '../types/graphql';
import * as sql from '../types/database';
import { ForbiddenError, UserInputError } from 'apollo-server';

const BOOKING_TABLE = 'booking_requests';

export default class BookingRequestAPI extends dbUtils.KnexDataSource {

  private async addBookablesToBookingRequest(br: sql.BookingRequest): Promise<sql.BookingRequest> {
    const bookables: sql.Bookable[] = await this.knex(BOOKING_TABLE)
      .select('bookables.*')
      .innerJoin('booking_bookables', 'booking_bookables.booking_request_id', 'booking_requests.id')
      .innerJoin('bookables', 'booking_bookables.bookable_id', 'bookables.id')
      .where('booking_requests.id', br.id)
      .returning('*');
    br.what = bookables;
    return br;
  }

  private sql2gql(br: sql.BookingRequest): gql.BookingRequest {
    const { booker_id, status, ...rest } = br;
    return {
      booker: { id: booker_id },
      status: status as gql.BookingStatus,
      ...rest,
    }
  }

  getBookables = (context: context.UserContext): Promise<gql.Maybe<gql.Bookable[]>> =>
    this.withAccess('booking_request:bookable:read', context, async () => {
      return await this.knex<sql.Bookable>('bookables');
    });

  getBookingRequest = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.BookingRequest>> =>
    this.withAccess('booking_request:read', context, async () => {
      const br = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }))
      if (br) {
        return this.sql2gql(await this.addBookablesToBookingRequest(br));
      } else {
        return undefined;
      }
    });

  getBookingRequests = (context: context.UserContext, filter?: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest[]>> =>
    this.withAccess('booking_request:read', context, async () => {
      let req = this.knex<sql.BookingRequest>(BOOKING_TABLE)
        .orderBy([{ column: 'start', order: 'asc' }]);

      if (filter) {
        if (filter.from || filter.to) {
          if (!filter.to)
            req = req.where('start', '>', filter.from)
          else if (!filter.from)
            req = req.where('start', '<', filter.to)
          else
            req = req.whereBetween('start', [filter.from, filter.to])

          if (filter.status)
            req = req.andWhere({ status: filter.status })

        } else if (filter.status) {
          req = req.where({ status: filter.status })
        }
      }

      let bookingRequests: sql.BookingRequest[] = await req;

      for await (let br of bookingRequests) {
        await this.addBookablesToBookingRequest(br)
      }

      return bookingRequests.map(this.sql2gql);
    });

  createBookingRequest = (context: context.UserContext, input: gql.CreateBookingRequest): Promise<gql.Maybe<gql.BookingRequest>> =>
    this.withAccess('booking_request:create', context, async () => {
      const { start, end, what, ...rest } = input;
      const startDate = new Date(start)
      const endDate = new Date(end)
      if (startDate > endDate) throw new UserInputError('Start cannot be after end')


      const bookingRequest = {
        status: gql.BookingStatus.Pending,
        start: startDate,
        end: endDate,
        ...rest
      };
      const id = (await this.knex<sql.BookingRequest>(BOOKING_TABLE).insert(bookingRequest).returning('id'))[0];
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));

      for await (let bookableId of what) {
        await this.knex<sql.BookingBookables>('booking_bookables').insert({ booking_request_id: id, bookable_id: bookableId });
      }

      return (res) ? this.sql2gql(await this.addBookablesToBookingRequest(res)) : undefined;
    });

  updateBookingRequest = (context: context.UserContext, id: UUID, input: gql.UpdateBookingRequest): Promise<gql.Maybe<gql.BookingRequest>> =>
    this.withAccess('booking_request:update', context, async () => {
      const { start, end, what, ...rest } = input;

      const bookingRequest = {
        start: start ?? new Date(start),
        end: end ?? new Date(end),
        ...rest
      };

      await this.knex(BOOKING_TABLE).where({ id }).update(bookingRequest);
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));

      if (what) {
        for await (let bookableId of what) {
          await this.knex<sql.BookingBookables>('booking_bookables').insert({ booking_request_id: id, bookable_id: bookableId });
        }
      }

      return (res) ? this.sql2gql(await this.addBookablesToBookingRequest(res)) : undefined;
    });

  removeBookingRequest = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.BookingRequest>> =>
    this.withAccess('booking_request:delete', context, async () => {
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));
      await this.knex(BOOKING_TABLE).where({ id }).del()

      return (res) ? this.sql2gql(res) : undefined;
    });

  updateStatus = (context: context.UserContext, id: UUID, status: gql.BookingStatus) =>
    this.withAccess('booking_request:update', context, async () => {
      return this.knex(BOOKING_TABLE).where({ id }).update({ status: status })
    });
}
