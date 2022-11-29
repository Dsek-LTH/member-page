import { DateTime } from 'luxon';
import {
  EventsQuery, GetBookingsQuery,
} from '~/generated/graphql';
import { CalendarEvent, CalendarEventType } from '~/types/CalendarEvent';

export const serializeEvent = (
  event: EventsQuery['events']['events'][number],
): CalendarEvent => ({
  id: event.id,
  title: event.title,
  titleEn: event.title_en || event.title,
  start: new Date(event.start_datetime),
  end: new Date(event.end_datetime),
  description: event.short_description,
  descriptionEn: event.short_description_en || event.short_description,
  type: CalendarEventType.Event,
  isSelected: false,
  allDay: false,
});

export const serializeBooking = (booking: GetBookingsQuery['bookingRequests'][number]): CalendarEvent => ({
  id: booking.id,
  title: booking.event,
  titleEn: booking.event,
  description: booking.what.map((b) => b.name).join(', '),
  descriptionEn: booking.what.map((b) => b.name_en).join(', '),
  start: new Date(booking.start),
  end: new Date(booking.end),
  type: CalendarEventType.Booking,
  isSelected: false,
});

export function serialize(
  events?: EventsQuery,
  bookings?: GetBookingsQuery,
): CalendarEvent[] {
  const serializedEvents = events?.events?.events.map(serializeEvent) || [];
  const serializedBookings = bookings?.bookingRequests.map(serializeBooking) || [];
  return [...serializedEvents, ...serializedBookings];
}

export function filterCalendarEvents(
  events: CalendarEvent[],
  showEvents: boolean,
  showBookings: boolean,
) {
  return events.filter((event) => {
    if (event.type === CalendarEventType.Event && showEvents) return true;
    if (event.type === CalendarEventType.Booking && showBookings) return true;
    return false;
  });
}

export const calendarDate = (date: DateTime) => `${date.year}-${date.month.toString().padStart(2, '0')}-15`;
