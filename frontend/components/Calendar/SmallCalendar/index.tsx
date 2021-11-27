import { BookingRequest, EventsQuery } from '~/generated/graphql';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

type PropTypes = {
  events: EventsQuery['events']['events'];
  bookings: BookingRequest[];
};

export default function SmallCalendar({ events, bookings }: PropTypes) {
  return (
    <Calendar
      events={events}
      bookings={bookings}
      CustomToolbar={CustomToolbar}
      height="350px"
      size={Size.Small}
      views={['month']}
    />
  );
}
