import {dbUtils, context} from 'dsek-shared';

import * as gql from '../types/graphql';
import * as sql from '../types/mysql';
import { ForbiddenError } from 'apollo-server';

const BOOKING_TABLE = 'booking_requests';

export default class BookingRequestAPI extends dbUtils.KnexDataSource {
  private sql2gql(br: sql.DbBookingRequest): gql.BookingRequest {
    const {booker_id, status, ...rest} = br;
    return {
      booker: {id: booker_id},
      status: status as gql.BookingStatus,
      ...rest,
    }
  }

  async getBookingRequest(id: number): Promise<gql.Maybe<gql.BookingRequest>>{
    const br = await dbUtils.unique(this.knex<sql.DbBookingRequest>(BOOKING_TABLE).where({id}))
    if (br)
      return this.sql2gql(br);
    else
      return undefined;
  }

  async getBookingRequests(filter?: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest[]>> {
    let req = this.knex<sql.DbBookingRequest>(BOOKING_TABLE)
    .select('*')
    .orderBy([{ column: 'start', order: 'asc' }, { column: 'what', order: 'asc' }])

    if (filter) {
      if (filter.from || filter.to) {
        if (!filter.to)
          req = req.where('start', '>', filter.from)
        else if (!filter.from)
          req = req.where('start', '<', filter.to)
        else
          req = req.whereBetween('start', [filter.from, filter.to])

        if (filter.status)
          req = req.andWhere({status: filter.status})

      } else if (filter.status) {
        req = req.where({status: filter.status})
      }
    }

    return (await req).map(this.sql2gql);
  }

  async createBookingRequest(context: context.UserContext | undefined, input: gql.CreateBookingRequest): Promise<gql.Maybe<gql.BookingRequest>> {
    if(!context?.user) throw new ForbiddenError('Operation denied');

    const bookingRequest = {status: gql.BookingStatus.Pending, ...input};
    const id = (await this.knex<sql.DbBookingRequest>(BOOKING_TABLE).insert(bookingRequest))[0];
    const res = await dbUtils.unique(this.knex<sql.DbBookingRequest>(BOOKING_TABLE).where({id}));

    return (res) ? this.sql2gql(res) : undefined;
  }

  async updateBookingRequest(context: context.UserContext | undefined, id: number, input: gql.UpdateBookingRequest): Promise<gql.Maybe<gql.BookingRequest>> {
    if(!context?.user) throw new ForbiddenError('Operation denied'); //check user == creator || user == admin

    await this.knex(BOOKING_TABLE).where({id}).update(input);
    const res = await dbUtils.unique(this.knex<sql.DbBookingRequest>(BOOKING_TABLE).where({id}));

    return (res) ? this.sql2gql(res) : undefined;
  }

  async removeBookingRequest(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.BookingRequest>> {
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin/creator

    const res = await dbUtils.unique(this.knex<sql.DbBookingRequest>(BOOKING_TABLE).where({id}));
    await this.knex(BOOKING_TABLE).where({id}).del()

    return (res) ? this.sql2gql(res) : undefined;
  }

  updateStatus(context: context.UserContext | undefined, id: number, status: gql.BookingStatus){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin
    return this.knex(BOOKING_TABLE).where({id}).update({status: status})
  }
}
