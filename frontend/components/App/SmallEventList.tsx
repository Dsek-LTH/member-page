import { Stack } from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { SmallEventCard } from '~/components/Calendar/EventCard';
import { SmallArticleSkeleton } from '~/components/News/articleSkeleton';
import { sortByStartDateAscending } from '~/functions/sortByDate';
import { useEventsQuery } from '~/generated/graphql';

const now = DateTime.now();
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
    .slice(0, 2);
  const { t } = useTranslation();

  return (
    <Stack gap={1}>
      <h2 style={{ marginBottom: 0 }}>{t('upcomingEvents')}</h2>
      {loading && (
      <>
        <SmallArticleSkeleton />
        <SmallArticleSkeleton />
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
