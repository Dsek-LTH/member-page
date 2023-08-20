import {
  Box, Dialog, Theme, Typography, useMediaQuery,
} from '@mui/material';
import { DateTime, Info, StringUnitLength } from 'luxon';
import range from 'lodash/range';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useEventsQuery } from '~/generated/graphql';
import { EventCard as EventDialogCard, EventTagIcon, EventsType } from './Events';
import { sortByStartDateAscending } from '~/functions/sortByDate';

const now = DateTime.now();
const START_DATE = DateTime.fromISO('2023-08-21');
const NUMBER_OF_WEEKS = 6;
const NUMBER_OF_DAYS = 7;

const useResponsiveOption = (options: any[]) => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'));

  let index = options.length - 1;
  if (isMediumScreen && index > 0) index -= 1;
  if (isSmallScreen && index > 0) index -= 1;

  return options[index];
};

function Header() {
  const weekdayFormat: StringUnitLength = useResponsiveOption([
    'short',
    'long',
  ]);
  const { i18n } = useTranslation();

  return (
    <>
      {range(NUMBER_OF_DAYS).map((i) => (
        <Box
          key={i}
          sx={{
            gridColumnStart: i + 2,
            textShadow: '0 0 10px white',
            mb: 1,
          }}
        >
          {/* 1-indexed and skipping first cell */}
          {Info.weekdays(weekdayFormat, { locale: i18n.language })[
            i
          ].toLocaleUpperCase()}
        </Box>
      ))}
    </>
  );
}

function WeekColumn() {
  const { i18n } = useTranslation();
  const weekFormatSv: StringUnitLength = useResponsiveOption([
    '',
    'V\u00A0', // non-breaking space
    'VECKA\u00A0',
  ]);
  const weekFormatEn: StringUnitLength = useResponsiveOption([
    '',
    'W\u00A0', // non-breaking space
    'WEEK\u00A0',
  ]);
  const weekFormat = i18n.language === 'sv' ? weekFormatSv : weekFormatEn;

  return (
    <>
      {range(NUMBER_OF_WEEKS).map((i) => (
        <Box
          key={i}
          sx={{
            position: 'sticky',
            left: 0,
            mr: 1,
            alignSelf: 'center',
            gridColumnStart: 1,
            gridRowStart: i + 2,
            textShadow: '0 0 10px white',
          }}
        >
          {/* 1-indexed and skipping first cell */}
          {`${weekFormat}${i}`}
        </Box>
      ))}
    </>
  );
}

function EventCard({ event }: { event: EventsType[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={(t) => ({
          bgcolor: '#ececec',
          color: 'black',
          p: 1,
          mb: 1,
          borderRadius: 1,
          [open ? '&' : '&:hover']: {
            boxShadow: '5px 5px 20px rgba(255, 255, 255, 0.25)',
            transform: 'translate(-1px, -1px)',
            cursor: 'pointer',
          },
          transition: t.transitions.create(['box-shadow', 'transform']),
        })}
        onClick={() => setOpen(true)}
      >
        <Box sx={{
          display: 'flex', gap: 1, alignItems: 'center',
        }}
        >
          <EventTagIcon event={event} />
          <Typography sx={{ width: '100%' }}>{event.title}</Typography>
        </Box>
      </Box>
      <Dialog
        disableScrollLock
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
      >
        <EventDialogCard event={event} />
      </Dialog>
    </>
  );
}

function EventGrid() {
  const { data } = useEventsQuery({
    variables: { start_datetime: now.minus({ month: 1 }), nollning: true },
  });

  const eventsPerDay = useMemo(() => {
    const eventMap: Record<string, EventsType> = {};
    data?.events.events
      .filter((event) => DateTime.fromISO(event.end_datetime) > now)
      .sort(sortByStartDateAscending)
      .forEach((event) => {
        const date = DateTime.fromISO(event.start_datetime)
          .startOf('day')
          .toISODate();
        if (!eventMap?.[date]) eventMap[date] = [];
        eventMap[date].push(event);
      });
    return eventMap;
  }, [data?.events.events]);

  return (
    <>
      {range(NUMBER_OF_WEEKS).map((w) =>
        range(NUMBER_OF_DAYS).map((d) => (
          <Box
            key={`${w}-${d}`}
            sx={{
              gridColumnStart: d + 2,
              gridRowStart: w + 2,
              border: '1px dashed #AAA',
              p: 1,
            }}
          >
            {eventsPerDay?.[
              START_DATE.plus({ weeks: w, days: d }).toISODate()
            ]?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Box>
        )))}
    </>
  );
}

export default function Calendar() {
  return (
    <Box sx={{ fontFamily: 'Moonrise', fontSize: 26 }}>
      <Box
        sx={{
          display: 'grid',
          overflowX: 'auto',
          gridTemplateColumns: 'auto repeat(7, minmax(125px, 1fr))',
          gridTemplateRows: 'auto repeat(6, 1fr)',
          p: 1,
        }}
      >
        <Header />
        <WeekColumn />
        <EventGrid />
      </Box>
    </Box>
  );
}
