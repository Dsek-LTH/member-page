import { BookingRequest, Event } from '~/generated/graphql';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

type PropTypes = {
  events: Event[];
  bookings: BookingRequest[];
};

export default function SmallCalendar({ events, bookings }: PropTypes) {
  return (
    <Calendar
      events={events}
      bookings={bookings}
      toolbar={CustomToolbar}
      height="350px"
      size={Size.Small}
      views={['month']}
    />
  );
}
