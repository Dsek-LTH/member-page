import { useState } from 'react';
import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { BookingRequest, Event } from '~/generated/graphql';
import {
  serializeBooking,
  serializeEvent,
} from '~/functions/calendarFunctions';
import CustomToolbar from './Toolbar';
import EventView from '../EventView';

// @ts-ignore
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });

type PropTypes = {
  events: Event[];
  bookings: BookingRequest[];
};

export default function BigCalendar({ events, bookings }: PropTypes) {
  const [serializedEvents] = useState([
    ...events.map((event) => serializeEvent(event)),
    ...bookings.map((booking) => serializeBooking(booking)),
  ]);

  return (
    <Calendar
      views={['month', 'week', 'day']}
      events={serializedEvents}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '400px' }}
      components={{ event: EventView, toolbar: CustomToolbar }}
      eventPropGetter={(event) => ({
        className: `${event.type}_event`,
      })}
    />
  );
}
