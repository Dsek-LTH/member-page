import { BookingRequest, Event } from "~/generated/graphql";
import { CalendarEvent, CalendarEventType } from "~/types/CalendarEvent";

export const serializeEvent = (event: Event): CalendarEvent => {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_datetime),
    end: new Date(event.end_datetime),
    description: event.description,
    type: CalendarEventType.Event,
    allDay: false,
  };
};

export const serializeBooking = (booking: BookingRequest): CalendarEvent => {
  return {
    id: booking.id,
    title: booking.event,
    description: booking.what,
    start: new Date(booking.start),
    end: new Date(booking.end),
    type: CalendarEventType.Booking,
  };
};
