import React from 'react';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import PassedEventSet from '~/components/Calendar/PassedEventSet';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import routes from '~/routes';

export default function EventsPage() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'event']);

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
        <div style={{ marginBottom: '0.5rem' }}>
          <EventSearchInput onSelect={(slug, id) => router.push(routes.event(slug || id))} />
        </div>
        <PassedEventSet />
      </Grid>
    </Grid>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
