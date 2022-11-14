import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import EventCard from './EventCard';
import {
  useEventsQuery,
} from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import NewsStepper from '../News/NewsStepper';
import { sortByStartDateDescending } from '~/functions/sortByDate';

const now = DateTime.now();

export default function PassedEventSet() {
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('news');
  const [page, setPage] = useState(0);
  const { loading, data } = useEventsQuery({
    variables:
     { page, perPage: 10, end_datetime: now },
  });

  const router = useRouter();

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(window.location.search).get('page');
    const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter, 10) : 0;
    setPage(pageNumber);
  }, []);

  const goBack = () => {
    router.push(`/events/passed?page=${page - 1}`);
    setPage(page - 1);
  };

  const goForward = () => {
    router.push(`/events/passed?page=${page + 1}`);
    setPage(page + 1);
  };

  const totalPages = data?.events?.pageInfo?.totalPages || 1;

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
      {Array.from(data?.events
        .events)
        .sort(sortByStartDateDescending)
        .map((event) =>
          (event ? (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ) : (
            <div>{t('articleError')}</div>
          )))}
      <NewsStepper
        index={page}
        onForwardClick={goForward}
        onBackwardClick={goBack}
        pages={totalPages}
      />
    </div>
  );
}
