import { Dispatch, SetStateAction, useState } from 'react';
import { Tooltip as HtmlToolTip, ClickAwayListener } from '@mui/material';
import { EventProps } from 'react-big-calendar';
import { CalendarEvent } from '~/types/CalendarEvent';
import Tooltip from './Tooltip';

type EventViewProps = {
  selectedEventId: number;
  setSelectedEventId: Dispatch<SetStateAction<number>>;
} & EventProps;

function EventView(props: EventViewProps) {
  const { selectedEventId, setSelectedEventId } = props;
  const event = props.event as CalendarEvent;
  const isSelected = selectedEventId === event.id;
  return (
    <ClickAwayListener
      onClickAway={(event) => {
        setSelectedEventId(null);
      }}
      touchEvent={false}
    >
      <HtmlToolTip open={isSelected} title={<Tooltip event={event} />}>
        <div
          onClick={() => {
            setSelectedEventId(event.id);
          }}
          style={{ height: '100%', width: '100%' }}
        >
          {event.title}
        </div>
      </HtmlToolTip>
    </ClickAwayListener>
  );
}

export default EventView;
