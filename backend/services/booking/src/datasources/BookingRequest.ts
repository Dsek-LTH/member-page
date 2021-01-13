import {dbUtils, context} from 'dsek-shared';

import * as gql from '../types/graphql';
import * as sql from '../types/mysql';
import { ForbiddenError } from 'apollo-server';

const BOOKING_TABLE = 'booking_requests';

export default class BookingRequestAPI extends dbUtils.KnexDataSource {
  createBookingRequest(context: context.UserContext | undefined, input: gql.CreateBookingRequest) {
    if(!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex(BOOKING_TABLE).insert({status: gql.BookingStatus.Pending, ...input})
  }

  getBookingRequest(identifier: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest>>{
    return dbUtils.unique(this.getBookingRequests(identifier))
  }

  async getBookingRequests(filter?: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest[]>> {
    const res = await this.knex<sql.DbBookingRequest>(BOOKING_TABLE).select('*').where(filter || {})
    const bookingRequests: gql.BookingRequest[] = res.map(br => ({
      ...br,
      booker: {id: br.booker_id},
      status: br.status as gql.BookingStatus
    }))
    return bookingRequests;
  }

  //privileged roles
  updateBookingRequest(context: context.UserContext | undefined, id: number, input: gql.UpdateBookingRequest){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //check user == creator || user == admin
    if(Object.keys(input).length == 0) return new Promise(resolve => resolve(false));
    return this.knex(BOOKING_TABLE).where({id}).update(input)
  }

  removeBookingRequest(context: context.UserContext | undefined, id: number){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin/creator
    return this.knex(BOOKING_TABLE).where({id}).del()
  }

  updateStatus(context: context.UserContext | undefined, id: number, status: gql.BookingStatus){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin
    return this.knex(BOOKING_TABLE).where({id}).update({status: status})
  }
}
