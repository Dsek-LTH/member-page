import { knex } from 'dsek-shared';

import BookingRequestAPI from './datasources/BookingRequest';

export interface DataSources {
  bookingRequestAPI: BookingRequestAPI,
}

export default () => {
  return {
    bookingRequestAPI: new BookingRequestAPI(knex),
  }
}