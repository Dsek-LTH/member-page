import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import PlaceIcon from '@mui/icons-material/Place';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WineBarIcon from '@mui/icons-material/WineBar';
import {
  Box, Paper, Stack, Tooltip, Typography, Zoom,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { authorIsUser } from '~/functions/authorFunctions';
import { sortByStartDateAscending } from '~/functions/sortByDate';
import { EventsQuery, useEventsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Link from '../Link';

const now = DateTime.now();

export type EventsType = EventsQuery['events']['events'];

export const TAGS = {
  food: '🍴 Gratis mat',
  pub: '🍻 Pub',
  sit: '🍽 Sittning',
} as const;

export function eventHasTag(event: EventsType[number], tagName: string) {
  return event.tags.some((t) => t.name === tagName);
}

/** Allows only one tag icon per event */
export function EventTagIcon({ event }: { event: EventsType[number] }) {
  const { i18n } = useTranslation();
  const findTagName = (tag: keyof typeof TAGS) =>
    event.tags.find((t) => t.name === TAGS[tag])?.[
      i18n.language === 'sv' ? 'name' : 'nameEn'
    ];

  if (eventHasTag(event, TAGS.food)) {
    return (
      <Tooltip title={findTagName('food')} arrow TransitionComponent={Zoom}>
        <LunchDiningIcon />
      </Tooltip>
    );
  }
  if (eventHasTag(event, TAGS.pub)) {
    return (
      <Tooltip title={findTagName('pub')} arrow TransitionComponent={Zoom}>
        <SportsBarIcon />
      </Tooltip>
    );
  }
  if (eventHasTag(event, TAGS.sit)) {
    return (
      <Tooltip title={findTagName('sit')} arrow TransitionComponent={Zoom}>
        <WineBarIcon />
      </Tooltip>
    );
  }

  return null;
}

function DayCard({
  date,
  children,
}: React.PropsWithChildren<{ date: DateTime }>) {
  const { i18n } = useTranslation();

  return (
    <Paper sx={{ p: 2 }} elevation={4}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold">
          {date
            .toLocaleString(
              { weekday: 'long', day: 'numeric', month: 'numeric' },
              { locale: i18n.language },
            )
            .toLocaleUpperCase(i18n.language)}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

export function EventCard({ event }: { event: EventsType[number] }) {
  const { t, i18n } = useTranslation(['common']);
  const apiContext = useApiAccess();
  const { user } = useUser();

  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const eventTimeString = `${startDate.toLocaleString(
    DateTime.TIME_24_SIMPLE,
  )} - ${endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}`;

  return (
    <Paper sx={{ p: 2, bgcolor: '#ececec', color: 'black' }}>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={500}>
            {event.title}
          </Typography>
          <EventTagIcon event={event} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Stack direction="row" spacing={0.5}>
            <WatchLaterIcon />
            <Typography>{eventTimeString}</Typography>
          </Stack>
          {event.location && (
            <Stack direction="row" spacing={0.5}>
              <PlaceIcon />
              <Typography>{event.location}</Typography>
            </Stack>
          )}
          {event.organizer && (
            <Stack direction="row" spacing={0.5}>
              <AssignmentIndIcon />
              <Typography>{event.organizer}</Typography>
            </Stack>
          )}
        </Box>

        <Typography sx={{ maxWidth: '60ch' }}>{event.description}</Typography>

        {(hasAccess(apiContext, 'event:update')
          || authorIsUser(event.author, user)) && (
          <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
        )}
      </Stack>
    </Paper>
  );
}

export default function Events() {
  const { t } = useTranslation('news');

  const { loading, data } = useEventsQuery({
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

  if (loading) {
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    );
  }
  if (!data?.events) return <p>{t('failedLoadingNews')}</p>;

  return (
    <>
      {Object.entries(eventsPerDay).map(([date, events]) => (
        <DayCard key={date} date={DateTime.fromISO(date)}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </DayCard>
      ))}
    </>
  );
}
