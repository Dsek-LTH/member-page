import { useState } from 'react';
import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { makeStyles } from '@material-ui/styles';
import { DateTime } from 'luxon';
import events from './events';
import { BookingRequest, Event } from '~/generated/graphql';
import {
  serializeBooking,
  serializeEvent,
} from '~/functions/calendarFunctions';
import CustomToolbar from './Toolbar';

// @ts-ignore
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });

function EventView({ event }) {
  return <div title={event.description}>{event.title}</div>;
}

type PropTypes = {
  events: Event[];
  bookings: BookingRequest[];
};

export default function BigCalendar({ events, bookings }: PropTypes) {
  const [serializedEvents] = useState([
    ...events.map((event) => serializeEvent(event)),
    ...bookings.map((booking) => serializeBooking(booking)),
  ]);

  const useStyles = makeStyles({
    outer: {
      width: '100%',
    },
  });
  const classes = useStyles();

  return (
    <Calendar
      views={['month', 'week', 'day']}
      events={serializedEvents}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      components={{ event: EventView, toolbar: CustomToolbar }}
    />
  );
}
