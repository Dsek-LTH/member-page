import { Calendar, luxonLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { makeStyles } from '@material-ui/styles';
import { DateTime } from 'luxon';
import events from './events';

// @ts-ignore
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });

function Event({ event }) {
  return <div>{event.title}</div>;
}

export default function MonthlyCalendar() {
  const useStyles = makeStyles({
    outer: {
      width: '100%',
    },
  });
  const classes = useStyles();

  return (
    <Calendar
      views={['month', 'week', 'day']}
      events={events}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      components={{ event: Event }}
    />
  );
}
