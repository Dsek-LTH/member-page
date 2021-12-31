import React, { useEffect } from 'react';
import { useEventsQuery } from '~/generated/graphql';
import EventCard from './EventCard';
import { useTranslation } from 'next-i18next';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { DateTime } from 'luxon';

type newsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  fullArticles?: boolean;
};

const now = DateTime.now();

export default function EventSet({
  showPastEvents = false,
  small = false,
}: {
  showPastEvents?: boolean;
  small?: boolean;
}) {
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t, i18n } = useTranslation('news');

  const { loading, data, refetch } = useEventsQuery();

  useEffect(() => {
    refetch({ start_datetime: showPastEvents ? undefined : now });
  }, [showPastEvents]);

  if (loading || !initialized)
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    );

  if (!data?.events) return <p>{t('failedLoadingNews')}</p>;

  return (
    <>
      {data?.events.events.map((event) =>
        event ? (
          <div key={event.id}>
            <EventCard event={event} small={small} />
          </div>
        ) : (
          <div>{t('articleError')}</div>
        )
      )}
    </>
  );
}
