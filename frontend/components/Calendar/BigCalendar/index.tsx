import React from 'react';
import { BookingRequest, EventsQuery } from '~/generated/graphql';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

type PropTypes = {
  events: EventsQuery['events']['events'];
  bookings: BookingRequest[];
};

export default function BigCalendar({ events, bookings }: PropTypes) {
  return (
    <Calendar
      events={events || []}
      bookings={bookings || []}
      CustomToolbar={CustomToolbar}
      height="78vh"
      size={Size.Large}
    />
  );
}
