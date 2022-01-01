import React from 'react';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEventsQuery } from '~/generated/graphql';
import EventSet from '~/components/Calendar/EventSet';

export default function EventsPage() {
  const { t } = useTranslation('common');

  const { data } = useEventsQuery();

  if (!data?.events) return <p />;

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <h2>{t('events')}</h2>
        <EventSet />
      </Grid>
    </Grid>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
