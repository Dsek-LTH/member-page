import * as sql from '../src/types/database';
import { BookingRequest, BookingStatus } from '../src/types/graphql';

export const dbBookingRequests: sql.BookingRequest[] = [
  {
    id: 1,
    what: 'iDét',
    booker_id: 1,
    event: 'Sitting',
    status: 'PENDING',
    start: new Date("2021-04-22 17:00:00"),
    end: new Date("2021-04-22 20:00:00"),
    created: new Date("2021-04-22 16:00:00"),
  },
  {
    id: 2,
    start: new Date("2021-04-23 17:00:00"),
    end: new Date("2021-04-23 20:00:00"),
    created: new Date("2021-04-23 16:00:00"),
    what: 'Shäraton',
    booker_id: 2,
    event: 'Filmkväll',
    status: 'PENDING',
  },
  {
    id: 3,
    start: new Date("2021-04-24 17:00:00"),
    end: new Date("2021-04-24 20:00:00"),
    created: new Date("2021-04-23 16:00:00"),
    what: 'Styrelserummet',
    booker_id: 1,
    event: 'Framtidsmöte',
    status: 'ACCEPTED',
  },
  {
    id: 4,
    start: new Date("2021-04-25 17:00:00"),
    end: new Date("2021-04-25 20:00:00"),
    created: new Date("2021-04-23 17:00:00"),
    what: 'iDét',
    booker_id: 5,
    event: 'Studiekväll',
    status: 'DENIED',
  },
]

export const bookingRequests: BookingRequest[] = [
  {
    id: 1,
    what: 'iDét',
    booker: {
      id: 1,
    },
    event: 'Sitting',
    status: BookingStatus.Pending,
    start: new Date("2021-04-22 17:00:00"),
    end: new Date("2021-04-22 20:00:00"),
    created: new Date("2021-04-22 16:00:00"),
  },
  {
    id: 2,
    start: new Date("2021-04-23 17:00:00"),
    end: new Date("2021-04-23 20:00:00"),
    created: new Date("2021-04-23 16:00:00"),
    what: 'Shäraton',
    booker: {
      id: 2
    },
    event: 'Filmkväll',
    status: BookingStatus.Pending,
  },
  {
    id: 3,
    start: new Date("2021-04-24 17:00:00"),
    end: new Date("2021-04-24 20:00:00"),
    created: new Date("2021-04-23 16:00:00"),
    what: 'Styrelserummet',
    booker: {
      id: 1,
    },
    event: 'Framtidsmöte',
    status: BookingStatus.Accepted,
  },
  {
    id: 4,
    start: new Date("2021-04-25 17:00:00"),
    end: new Date("2021-04-25 20:00:00"),
    created: new Date("2021-04-23 17:00:00"),
    what: 'iDét',
    booker: {
      id: 5,
    },
    event: 'Studiekväll',
    status: BookingStatus.Denied,
  },
]