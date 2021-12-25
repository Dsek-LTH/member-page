import { knex } from 'dsek-shared';

import BookingRequestAPI from './datasources/BookingRequest';

export interface DataSources {
  bookingRequestAPI: BookingRequestAPI,
}

export default () => ({
  bookingRequestAPI: new BookingRequestAPI(knex),
});
