export enum CalendarEventType {
  Event = 'event',
  Booking = 'booking',
}

export type CalendarEvent = {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  isSelected: boolean;
  type: CalendarEventType;
};
