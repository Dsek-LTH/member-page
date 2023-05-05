import
{
  Paper, Skeleton, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { SmallEventCard } from '~/components/Calendar/EventCard';
import { sortByStartDateAscending } from '~/functions/sortByDate';
import { useEventsQuery } from '~/generated/graphql';

const now = DateTime.now();

export function SmallEventSkeleton() {
  return (
    <Paper sx={{ p: 1 }}>
      <Stack
        direction="row"
        alignItems="stretch"
        style={{ position: 'relative' }}
        gap={1}
      >
        <Stack sx={{ flex: 1 }} justifyContent="space-between">
          <Skeleton height="1rem" />
          <Skeleton height="1.5rem" />
        </Stack>
      </Stack>
    </Paper>
  );
}

function SmallEventList() {
  const { data, loading } = useEventsQuery({
    variables:
     {
       start_datetime: now.minus({ month: 1 }),
       perPage: 1,

     },
  });
  const events = (data?.events?.events ?? [])
    .filter((event) =>
      (DateTime.fromISO(event.end_datetime) > now))
    .sort(sortByStartDateAscending)
    .slice(0, 3);
  const { t } = useTranslation();

  return (
    <Stack gap={1}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{t('upcomingEvents')}</Typography>
      {loading && (
      <>
        <SmallEventSkeleton />
        <SmallEventSkeleton />
        <SmallEventSkeleton />
      </>
      )}
      {events.map((event) => (
        <SmallEventCard
          key={event.id}
          event={event}
        />
      ))}
    </Stack>
  );
}

export default SmallEventList;
