/* eslint-disable max-len */
import { UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';

import * as gql from '../types/graphql';
import * as sql from '../types/booking';

const BOOKING_TABLE = 'booking_requests';
const BOOKABLES = 'bookables';
const BOOKING_BOOKABLES = 'booking_bookables';

export default class BookingRequestAPI extends dbUtils.KnexDataSource {
  private async addBookablesToBookingRequest(br: sql.BookingRequest): Promise<gql.BookingRequest> {
    const bookables: sql.Bookable[] = await this.knex(BOOKING_TABLE)
      .select('bookables.*')
      .join(BOOKING_BOOKABLES, 'booking_bookables.booking_request_id', 'booking_requests.id')
      .join(BOOKABLES, 'booking_bookables.bookable_id', 'bookables.id')
      .where('booking_requests.id', br.id)
      .returning('*');
    const {
      booker_id: bookerId, status, ...rest
    } = br;

    return {
      ...rest,
      booker: { id: bookerId },
      status: status as gql.BookingStatus,
      what: bookables,
    };
  }

  getBookableCategory(ctx: context.UserContext, id?: UUID): Promise<gql.Maybe<gql.BookableCategory>> {
    return this.withAccess('booking_request:bookable:read', ctx, async () => {
      const res = await dbUtils.unique(this.knex<sql.BookableCategory>('bookable_categories').where({ id }));
      return res;
    });
  }

  getBookable(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Bookable>> {
    return this.withAccess('booking_request:bookable:read', ctx, async () => {
      const res = await dbUtils.unique(this.knex<sql.Bookable>(BOOKABLES).where({ id }));
      return res;
    });
  }

  getBookables(ctx: context.UserContext, includeDisabled?: boolean): Promise<gql.Bookable[]> {
    return this.withAccess('booking_request:bookable:read', ctx, async () => {
      if (includeDisabled) {
        return this.knex<sql.Bookable>(BOOKABLES);
      }
      return this.knex<sql.Bookable>(BOOKABLES).where({ isDisabled: false });
    });
  }

  getBookingRequest(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.BookingRequest>> {
    return this.withAccess('booking_request:read', ctx, async () => {
      const br = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));
      if (br) {
        return this.addBookablesToBookingRequest(br);
      }
      return undefined;
    });
  }

  getBookingRequests(
    ctx: context.UserContext,
    filter?: gql.BookingFilter,
  ): Promise<gql.BookingRequest[]> {
    return this.withAccess('booking_request:read', ctx, async () => {
      let req = this.knex<sql.BookingRequest>(BOOKING_TABLE)
        .orderBy([{ column: 'start', order: 'asc' }]);

      if (filter) {
        if (filter.from) {
          req = req.where('start', '>=', filter.from);
        }
        if (filter.to) {
          req = req.where('end', '<=', filter.to);
        }
        if (filter.status) {
          req = req.where({ status: filter.status });
        }
      }

      const bookingRequests: sql.BookingRequest[] = await req;

      return Promise.all(bookingRequests.map((br) => this.addBookablesToBookingRequest(br)));
    });
  }

  createBookable(
    ctx: context.UserContext,
    input: gql.CreateBookable,
  ): Promise<gql.Maybe<gql.Bookable>> {
    return this.withAccess('booking_request:bookable:create', ctx, async () => {
      const { name, name_en: nameEn, categoryId } = input;
      const { id } = await this.knex(BOOKABLES).insert({ name, name_en: nameEn ?? name, categoryId }).returning('id').first();
      const res = await dbUtils.unique(this.knex<sql.Bookable>(BOOKABLES).where({ id }));

      return res;
    });
  }

  updateBookable(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateBookable,
  ): Promise<gql.Maybe<gql.Bookable>> {
    return this.withAccess('booking_request:bookable:update', ctx, async () => {
      await this.knex(BOOKABLES).where({ id }).update(input);
      const res = await dbUtils.unique(this.knex<sql.Bookable>(BOOKABLES).where({ id }));
      if (!res) {
        throw new UserInputError('Bookable not found');
      }

      return res;
    });
  }

  createBookingRequest(
    ctx: context.UserContext,
    input: gql.CreateBookingRequest,
  ): Promise<gql.Maybe<gql.BookingRequest>> {
    return this.withAccess('booking_request:create', ctx, async () => {
      const {
        start, end, what, ...rest
      } = input;
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate > endDate) throw new UserInputError('Start cannot be after end');

      const bookingRequest = {
        status: gql.BookingStatus.Pending,
        start: startDate,
        end: endDate,
        ...rest,
      };
      const id = (await this.knex<sql.BookingRequest>(BOOKING_TABLE).insert(bookingRequest).returning('id'))[0];
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));

      await this.knex<sql.BookingBookables>('booking_bookables')
        .insert(what.map((w) => ({ booking_request_id: id, bookable_id: w })));

      return (res) ? this.addBookablesToBookingRequest(res) : undefined;
    });
  }

  updateBookingRequest(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateBookingRequest,
  ): Promise<gql.Maybe<gql.BookingRequest>> {
    return this.withAccess('booking_request:update', ctx, async () => {
      const {
        start, end, what, ...rest
      } = input;

      const bookingRequest = {
        start: start ?? new Date(start),
        end: end ?? new Date(end),
        ...rest,
      };

      await this.knex(BOOKING_TABLE).where({ id }).update(bookingRequest);
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));

      if (what) {
        const relations = what.map((bookableId) => ({
          booking_request_id: id,
          bookable_id: bookableId,
        }));
        await this.knex<sql.BookingBookables>(BOOKING_BOOKABLES).insert(relations);
      }

      return (res) ? this.addBookablesToBookingRequest(res) : undefined;
    });
  }

  async removeBookingRequest(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.BookingRequest>> {
    const request = await this.getBookingRequest(ctx, id);
    const booker = request?.booker;

    return this.withAccess('booking_request:delete', ctx, async () => {
      const res = await dbUtils.unique(this.knex<sql.BookingRequest>(BOOKING_TABLE).where({ id }));
      if (!res) return undefined;

      const br = await this.addBookablesToBookingRequest(res);
      await this.knex(BOOKING_BOOKABLES).where({ booking_request_id: id }).del();
      await this.knex(BOOKING_TABLE).where({ id }).del();

      return br;
    }, booker?.id);
  }

  updateStatus(ctx: context.UserContext, id: UUID, status: gql.BookingStatus) {
    return this.withAccess('booking_request:update', ctx, async () =>
      this.knex(BOOKING_TABLE).where({ id }).update({ status }));
  }
}
