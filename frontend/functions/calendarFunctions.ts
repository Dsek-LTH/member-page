import { BookingRequest, EventsQuery } from "~/generated/graphql";
import { CalendarEvent, CalendarEventType } from "~/types/CalendarEvent";

export const serializeEvent = (
  event: EventsQuery["events"]['events'][number]
): CalendarEvent => {
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
    titleEn: booking.event,
    description: booking.what.map(b => b.name).join(', '),
    descriptionEn: booking.what.map(b => b.name_en).join(', '),
    start: new Date(booking.start),
    end: new Date(booking.end),
    type: CalendarEventType.Booking,
    isSelected: false,
  };
};
