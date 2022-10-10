import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Grid,
  Paper,
} from '@mui/material';
import BigCalendar from '~/components/Calendar/BigCalendar';

export default function CalendarPage() {
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
        <h2>{t('calendar')}</h2>
        <Paper style={{ padding: '0.5rem' }}>
          <BigCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'event',
      'booking',
      'calendar',
    ])),
  },
});
