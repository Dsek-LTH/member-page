import { BookingRequest, Event } from "~/generated/graphql";
import { CalendarEvent, CalendarEventType } from "~/types/CalendarEvent";

export const serializeEvent = (event: Event): CalendarEvent => {
  return {
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
  };
};

export const serializeBooking = (booking: BookingRequest): CalendarEvent => {
  return {
    id: booking.id,
    title: booking.event,
    titleEn: booking.what,
    description: booking.what,
    descriptionEn: booking.what,
    start: new Date(booking.start),
    end: new Date(booking.end),
    type: CalendarEventType.Booking,
    isSelected: false,
  };
};
