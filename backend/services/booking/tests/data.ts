import * as sql from '../src/types/database';

export const createBookables: sql.CreateBookable = {
  name: 'iDét',
  name_en: 'iDét_en',
}

export const createBookingRequests: sql.CreateBookingRequest[] = [
  {
    start: new Date("2021-04-22 17:00:00"),
    end: new Date("2021-04-22 20:00:00"),
    event: 'Sitting',
    status: 'PENDING',
    booker_id: 1,
  },
  {
    start: new Date("2021-04-23 17:00:00"),
    end: new Date("2021-04-23 20:00:00"),
    event: 'Filmkväll',
    status: 'PENDING',
    booker_id: 1,
  },
  {
    start: new Date("2021-04-24 17:00:00"),
    end: new Date("2021-04-24 20:00:00"),
    event: 'Framtidsmöte',
    status: 'ACCEPTED',
    booker_id: 2,
  },
  {
    start: new Date("2021-04-25 17:00:00"),
    end: new Date("2021-04-25 20:00:00"),
    event: 'Studiekväll',
    status: 'DENIED',
    booker_id: 3,
  },
]
