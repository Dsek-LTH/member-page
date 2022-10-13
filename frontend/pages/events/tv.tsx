import React from 'react';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EventSet from '~/components/Calendar/UpcomingEventSet';

function EventsTVPage() {
  const { t } = useTranslation('common');

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

EventsTVPage.tv = true;

export default EventsTVPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
