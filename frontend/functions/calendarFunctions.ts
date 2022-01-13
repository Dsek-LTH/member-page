import { BookingRequest, EventsQuery } from '~/generated/graphql';
import { CalendarEvent, CalendarEventType } from '~/types/CalendarEvent';

export const serializeEvent = (
  event: EventsQuery['events']['events'][number],
): CalendarEvent => ({
  id: event.id,
  title: event.title,
  start: new Date(event.start_datetime),
  end: new Date(event.end_datetime),
  description: event.short_description,
  type: CalendarEventType.Event,
  isSelected: false,
  allDay: false,
});

export const serializeBooking = (booking: BookingRequest): CalendarEvent => ({
  id: booking.id,
  title: booking.event,
  description: booking.what.map((b) => b.name).join(', '),
  start: new Date(booking.start),
  end: new Date(booking.end),
  type: CalendarEventType.Booking,
  isSelected: false,
});
