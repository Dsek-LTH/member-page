import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import {
  Box, Paper, Stack, Typography,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PlaceIcon from '@mui/icons-material/Place';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { EventsQuery, useEventsQuery } from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { sortByStartDateAscending } from '~/functions/sortByDate';
import Link from '../Link';
import { authorIsUser } from '~/functions/authorFunctions';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';

const now = DateTime.now();

export type EventsType = EventsQuery['events']['events'];

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
        <Typography variant="h6" fontWeight={500}>
          {event.title}
        </Typography>

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
