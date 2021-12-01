import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Grid, Paper } from '@mui/material';
import { calendarPageStyles } from '~/styles/calendarPageStyles';
import BigCalendar from '~/components/Calendar/BigCalendar';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';

export default function CalendarPage() {
  const { data: eventsData, loading: eventsLoading } = useEventsQuery();
  const { data: bookingsData, loading: bookingsLoading } =
    useGetBookingsQuery();
  const classes = calendarPageStyles();
  const { t } = useTranslation('common');

  return (
    <>
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
            <BigCalendar
              events={eventsData?.events?.events}
              bookings={bookingsData?.bookingRequests}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
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
