import React, { useEffect, useState } from 'react';
import { useEventsQuery, EventsQuery } from '~/generated/graphql';
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

export default function EventSet() {
  const [filteredEvents, setFilteredEvents] = useState<EventsQuery['events']>(
    []
  );
  const [showPastEvents, setShowPastEvents] = useState(false);
  const { loading, data } = useEventsQuery();
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t, i18n } = useTranslation('news');

  useEffect(() => {
    if (data?.events) {
      var newFilteredEvents = [] as EventsQuery['events'];
      if (!showPastEvents) {
        const now = new Date().getTime();
        newFilteredEvents = data.events.filter(
          (event) => new Date(event.end_datetime).getTime() > now
        );
      } else {
        newFilteredEvents = data.events;
      }
      setFilteredEvents(newFilteredEvents);
    }
  }, [data, showPastEvents]);

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
        label={t('event:show_finished_events')}
      />
      {filteredEvents.map((event) =>
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
