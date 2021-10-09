export enum CalendarEventType {
  Event = "event",
  Booking = "booking",
}

export type CalendarEvent = {
  id: Number;
  title: String;
  description: String;
  allDay?: Boolean;
  start: Date;
  end: Date;
  isSelected: boolean;
  type: CalendarEventType;
};
