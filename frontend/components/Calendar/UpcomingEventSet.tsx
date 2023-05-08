/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import EventCard from './EventCard';
import {
  useEventsQuery,
} from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { sortByStartDateAscending } from '~/functions/sortByDate';

const now = DateTime.now();

export default function EventSet({ perPage }) {
  const { t } = useTranslation('news');

  const { loading, data } = useEventsQuery({
    variables:
     { start_datetime: now.minus({ month: 1 }), perPage },
  });

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
  const events = data?.events
    .events
    .filter((event) =>
      (DateTime.fromISO(event.end_datetime) > now))
    .sort(sortByStartDateAscending)
    .slice(0, perPage);

  return (
    <>
      {events
        .map((event) =>
          (event ? (
            <EventCard event={event} key={event.id} />
          ) : (
            <div>{t('news:eventError.missing')}</div>
          )))}
    </>
  );
}
