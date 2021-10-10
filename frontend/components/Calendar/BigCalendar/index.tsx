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
      events={events || []}
      bookings={bookings || []}
      CustomToolbar={CustomToolbar}
      height="78vh"
      size={Size.Large}
    />
  );
}
