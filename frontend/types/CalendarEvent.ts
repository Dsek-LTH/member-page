export enum CalendarEventType {
  Event = "event",
  Booking = "booking",
}

export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  isSelected: boolean;
  type: CalendarEventType;
};
