import React, { useEffect, useState } from 'react';
import {
  useEventsQuery,
  EventsQuery,
  EventFilter,
  EventQueryVariables,
} from '~/generated/graphql';
import SmallEventCard from './SmallEventCard';
import { useTranslation } from 'next-i18next';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Checkbox, FormControlLabel } from '@mui/material';
import { DateTime } from 'luxon';

type newsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  fullArticles?: boolean;
};

const now = DateTime.now();

export default function EventSet() {
  const [showPastEvents, setShowPastEvents] = useState(false);
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
        <ArticleSkeleton />
      </>
    );

  if (!data?.events) return <p>{t('failedLoadingNews')}</p>;

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={showPastEvents}
            onChange={(event) => {
              setShowPastEvents(event.target.checked);
            }}
          />
        }
        label={t('event:show_finished_events').toString()}
      />
      {data?.events.events.map((event) =>
        event ? (
          <div key={event.id}>
            <SmallEventCard event={event} />
          </div>
        ) : (
          <div>{t('articleError')}</div>
        )
      )}
    </div>
  );
}
