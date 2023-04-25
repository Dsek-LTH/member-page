import * as sql from '~/src/types/booking';

export const createBookables: sql.CreateBookable[] = [{
  name: 'iDét',
  name_en: 'iDét_en',
}, {
  name: 'Shäraton',
  name_en: 'Shäraton',
}, {
  name: 'Gamla iDét',
  name_en: 'Old iDét',
  isDisabled: true,
}];

export const bookableCategory: sql.BookableCategory[] = [{
  id: '55f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  name: 'Lokal',
  name_en: 'Place',
},
{
  id: '42a9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  name: 'Sak',
  name_en: 'Thing',
}];

export const createBookingRequests: sql.CreateBookingRequest[] = [
  {
    start: new Date('2021-04-22 17:00:00'),
    end: new Date('2021-04-22 20:00:00'),
    event: 'Sitting',
    status: 'PENDING',
    booker_id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
  },
  {
    start: new Date('2021-04-23 17:00:00'),
    end: new Date('2021-04-23 20:00:00'),
    event: 'Filmkväll',
    status: 'PENDING',
    booker_id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
  },
  {
    start: new Date('2021-04-24 17:00:00'),
    end: new Date('2021-04-24 20:00:00'),
    event: 'Framtidsmöte',
    status: 'ACCEPTED',
    booker_id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
  },
  {
    start: new Date('2021-04-25 17:00:00'),
    end: new Date('2021-04-25 20:00:00'),
    event: 'Studiekväll',
    status: 'DENIED',
    booker_id: 'd6e39f18-0247-4a48-a493-c0184af0fecd',
  },
];
