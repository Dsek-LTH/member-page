export enum CalendarEventType {
  Event = "event",
  Booking = "booking",
}

export type CalendarEvent = {
  id: Number;
  title: string;
  description: string;
  allDay?: Boolean;
  start: Date;
  end: Date;
  isSelected: boolean;
  type: CalendarEventType;
};
