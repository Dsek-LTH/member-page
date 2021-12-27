import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Checkbox, FormControlLabel } from '@mui/material';
import { DateTime } from 'luxon';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import SmallEventCard from './SmallEventCard';
import {
  useEventsQuery,
} from '~/generated/graphql';

export default function EventSet() {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('news');

  const { loading, data, refetch } = useEventsQuery();

  useEffect(() => {
    refetch({ start_datetime: showPastEvents ? undefined : DateTime.now() });
  }, [showPastEvents]);

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
      <FormControlLabel
        control={(
          <Checkbox
            checked={showPastEvents}
            onChange={(event) => {
              setShowPastEvents(event.target.checked);
            }}
          />
        )}
        label={t('event:show_finished_events').toString()}
      />
      {data?.events.events.map((event) =>
        (event ? (
          <div key={event.id}>
            <SmallEventCard event={event} />
          </div>
        ) : (
          <div>{t('articleError')}</div>
        )))}
    </div>
  );
}
