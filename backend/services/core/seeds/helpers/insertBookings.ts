import { Knex } from 'knex';
import { BookingBookables, BookingRequest } from '~/src/types/booking';

export default async function insertBookingRequests(
  knex: Knex,
  memberIds: string[],
  bookableIds: string[],
) {
  const bookingRequestIds = (await knex<BookingRequest>('booking_requests').insert([
    {
      booker_id: memberIds[0],
      start: new Date('2021-01-13 21:00'),
      end: new Date('2021-01-13 22:00'),
      event: 'Överlämning',
      status: 'ACCEPTED',
    },
    {
      booker_id: memberIds[1],
      start: new Date('2022-01-10 10:00'),
      end: new Date('2022-01-12 22:00'),
      event: 'Framtiden',
      status: 'PENDING',
    },
    {
      booker_id: memberIds[2],
      start: new Date('2022-01-01 00:00'),
      end: new Date('2022-01-01 23:59'),
      event: 'Nyår',
      status: 'PENDING',
    },
  ]).returning('id')).map((v) => v.id);

  await knex<BookingBookables>('booking_bookables').insert([
    {
      booking_request_id: bookingRequestIds[0],
      bookable_id: bookableIds[0],
    },
    {
      booking_request_id: bookingRequestIds[0],
      bookable_id: bookableIds[1],
    },
    {
      booking_request_id: bookingRequestIds[1],
      bookable_id: bookableIds[2],
    },
    {
      booking_request_id: bookingRequestIds[2],
      bookable_id: bookableIds[3],
    },
  ]);
}
