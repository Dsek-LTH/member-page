import { useState } from 'react';
import {
  Calendar as ReactBigCalendar,
  luxonLocalizer,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import { DateTime, Settings } from 'luxon';
import { BookingRequest, Event } from '~/generated/graphql';
import {
  serializeBooking,
  serializeEvent,
} from '~/functions/calendarFunctions';
import EventView from './EventView';
import { useTranslation } from 'react-i18next';
export enum Size {
  Small = 'sm',
  Large = 'lg',
}

type PropTypes = {
  events: Event[];
  bookings: BookingRequest[];
  height: string;
  toolbar: React.ComponentType<ToolbarProps>;
  size?: Size;
  views?: View[];
};

export default function Calendar({
  events,
  bookings,
  height,
  toolbar,
  size = Size.Large,
  views = ['month', 'week', 'day'],
}: PropTypes) {
  const [serializedEvents] = useState([
    ...events.map((event) => serializeEvent(event)),
    ...bookings.map((booking) => serializeBooking(booking)),
  ]);
  const { t, i18n } = useTranslation('common');
  Settings.defaultLocale = 'sv';
  // @ts-ignore
  const localizer = luxonLocalizer(DateTime, {
    firstDayOfWeek: 1,
  });
  const toLuxonDate = (date: Date) => {
    return DateTime.fromJSDate(date).setLocale(i18n.language);
  };
  return (
    <ReactBigCalendar
      views={views}
      events={serializedEvents}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height }}
      components={{
        toolbar: toolbar,
        event: EventView,
        month: {
          header: ({ date }) => <div>{toLuxonDate(date).weekdayShort}</div>,
        },
        week: {
          header: ({ date }) => (
            <div>
              {toLuxonDate(date).weekdayShort} {toLuxonDate(date).day}/
              {toLuxonDate(date).month}
            </div>
          ),
        },
      }}
      eventPropGetter={(event) => ({
        className: `event_${event.type} event_${size}`,
      })}
    />
  );
}
