import { useState } from 'react';
import { Tooltip as HtmlToolTip, ClickAwayListener } from '@material-ui/core';
import { CalendarEvent } from '~/types/CalendarEvent';
import Tooltip from './Tooltip';

function EventView(props) {
  const { event }: { event: CalendarEvent } = props;
  const [isSelected, setIsSelected] = useState(false);
  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsSelected(false);
      }}
    >
      <HtmlToolTip open={isSelected} title={<Tooltip event={event} />}>
        <div
          onClick={() => {
            setIsSelected(true);
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
