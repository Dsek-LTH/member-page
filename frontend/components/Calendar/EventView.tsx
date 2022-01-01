import React, { Dispatch, SetStateAction } from 'react';
import { Tooltip as HtmlToolTip, ClickAwayListener } from '@mui/material';
import { EventProps } from 'react-big-calendar';
import { CalendarEvent } from '~/types/CalendarEvent';
import Tooltip from './Tooltip';

type EventViewProps = {
  selectedEventId: number;
  setSelectedEventId: Dispatch<SetStateAction<number>>;
} & EventProps;

function EventView({
  event,
  selectedEventId,
  setSelectedEventId,
}: EventViewProps) {
  const calendarEvent = event as CalendarEvent;
  const isSelected = selectedEventId === calendarEvent.id;
  return (
    <ClickAwayListener
      onClickAway={() => {
        setSelectedEventId(null);
      }}
      touchEvent={false}
    >
      <HtmlToolTip open={isSelected} title={<Tooltip event={calendarEvent} />}>
        <div
          onClick={() => setSelectedEventId(calendarEvent.id)}
          onKeyPress={() => setSelectedEventId(calendarEvent.id)}
          style={{ height: '100%', width: '100%' }}
          role="button"
          tabIndex={0}
        >
          {event.title}
        </div>
      </HtmlToolTip>
    </ClickAwayListener>
  );
}

export default EventView;
