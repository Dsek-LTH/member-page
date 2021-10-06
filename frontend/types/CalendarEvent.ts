export enum CalendarEventType {
  Event,
  Booking,
}

export type CalendarEvent = {
  id: Number;
  title: String;
  description: String;
  allDay?: Boolean;
  start: Date;
  end: Date;
  type: CalendarEventType;
};
