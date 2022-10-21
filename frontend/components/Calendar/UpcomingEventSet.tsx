import React from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { DateTime } from 'luxon';
import EventCard from './EventCard';
import {
  useEventsQuery,
} from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { sortByStartDateAscending } from '~/functions/sortByDate';

const now = DateTime.now();

export default function EventSet() {
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('news');

  const { loading, data, refetch } = useEventsQuery({
    variables:
     { start_datetime: now.minus({ month: 1 }) },
  });

  if (loading || !initialized) {
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
    <div>
      {data?.events
        .events
        .filter((event) =>
          (DateTime.fromISO(event.end_datetime) > now))
        .sort(sortByStartDateAscending)
        .map((event) =>
          (event ? (
            <div key={event.id}>
              <EventCard event={event} refetch={refetch} />
            </div>
          ) : (
            <div>{t('articleError')}</div>
          )))}
    </div>
  );
}
