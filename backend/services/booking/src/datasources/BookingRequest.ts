import {dbUtils, context} from 'dsek-shared';

import * as gql from '../types/graphql';
import * as sql from '../types/mysql';
import { ForbiddenError } from 'apollo-server';
import { isThrowStatement } from 'typescript';


export default class BookingRequestAPI extends dbUtils.KnexDataSource {
  //TODO: Define all methods needed for the graphql resolvers.
  createBookingRequest(context: context.UserContext | undefined, input: sql.DbCreateBookingRequest) {
    if(!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('bookingRequests').insert(input)
  }

  getBookingRequest(identifier: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest>>{
    return dbUtils.unique(this.getBookingRequests(identifier))
  }

  getBookingRequests(filter?: gql.BookingFilter): Promise<gql.Maybe<gql.BookingRequest[]>> {
    return this.knex<sql.DbBookingRequest>('bookingRequests').select('*').where(filter || {}) //röd, understruken
  }

  //privileged roles
  updateBookingRequest(context: context.UserContext | undefined, id: number, input: sql.DbUpdateBookingRequest){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //check user == creator || user == admin
    if(Object.keys(input).length == 0) return new Promise(resolve => resolve(false));
    return this.knex('bookingRequests').where({id}).update(input)
  }

  removeBookingRequest(context: context.UserContext | undefined, id: number){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin/creator
    return this.knex('bookingRequests').where({id}).del()
  }

  updateStatus(context: context.UserContext | undefined, id: number, status: sql.DbUpdateBookingRequestStatus){
    if(!context?.user) throw new ForbiddenError('Operation denied'); //admin/creator
    return this.knex('bookingRequest').where({id}).update(status)
  }
}
