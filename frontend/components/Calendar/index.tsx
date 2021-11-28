import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  Calendar as ReactBigCalendar,
  luxonLocalizer,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import { DateTime, Settings } from 'luxon';
import { BookingRequest, EventsQuery } from '~/generated/graphql';
import {
  serializeBooking,
  serializeEvent,
} from '~/functions/calendarFunctions';
import EventView from './EventView';
import { useTranslation } from 'react-i18next';
import { CalendarEvent, CalendarEventType } from '~/types/CalendarEvent';
import Router from 'next/router';
import routes from '~/routes';

export type CustomToolbarProps = {
  showEvents: boolean;
  showBookings: boolean;
  setShowEvents: Dispatch<SetStateAction<boolean>>;
  setShowBookings: Dispatch<SetStateAction<boolean>>;
} & ToolbarProps;

export enum Size {
  Small = 'sm',
  Large = 'lg',
}

type PropTypes = {
  events: EventsQuery['events']['events'];
  bookings: BookingRequest[];
  height: string;
  CustomToolbar: React.ComponentType<CustomToolbarProps>;
  size?: Size;
  views?: View[];
};

export default function Calendar({
  events,
  bookings,
  height,
  CustomToolbar,
  size = Size.Large,
  views = ['month', 'week', 'day'],
}: PropTypes) {
  const [showEvents, setShowEvents] = useState(true);
  const [showBookings, setShowBookings] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [serializedEvents, setSerializedEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setSerializedEvents([
      ...events.map((event) => serializeEvent(event)),
      ...bookings.map((booking) => serializeBooking(booking)),
    ]);
  }, [events, bookings]);

  useEffect(() => {
    if (showEvents && showBookings) {
      setFilteredEvents(serializedEvents);
    } else if (showEvents) {
      setFilteredEvents(
        serializedEvents.filter(
          (serializedEvent) => serializedEvent.type === CalendarEventType.Event
        )
      );
    } else if (showBookings) {
      setFilteredEvents(
        serializedEvents.filter(
          (serializedEvent) =>
            serializedEvent.type === CalendarEventType.Booking
        )
      );
    } else {
      setFilteredEvents([]);
    }
  }, [serializedEvents, showEvents, showBookings]);

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
      events={filteredEvents}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height }}
      components={{
        dateCellWrapper: (props: any) => {
          const date = props.value as Date;
          const today = new Date();
          const isToday =
            `${date.getMonth()}${date.getDate()}` ===
            `${today.getMonth()}${today.getDate()}`;
          return <div className={`rbc-day-bg ${isToday ? 'rbc-today' : ''}`} />;
        },
        toolbar: (props) => (
          <CustomToolbar
            showEvents={showEvents}
            showBookings={showBookings}
            setShowBookings={setShowBookings}
            setShowEvents={setShowEvents}
            {...props}
          />
        ),
        event: (props) => (
          <EventView
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            {...props}
          />
        ),
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
        className: `event_${event.type}${selectedEventId === event.id ? '_selected' : ''
          } event_${size}`,
      })}
      onShowMore={() => {
        Router.push(routes.calendar);
      }}
      onDoubleClickEvent={(event) => {
        Router.push(routes.event(event.id));
      }}
    />
  );
}
