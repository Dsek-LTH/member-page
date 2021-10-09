import React from 'react';
import ArticleSet from '../components/News/articleSet';
import Grid from '@mui/material/Grid';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import DefaultLayout from '../layouts/defaultLayout';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';
import { Paper } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useTranslation('common');
  const {
    data: eventsData,
    error: eventsError,
    loading: eventsLoading,
  } = useEventsQuery();
  const {
    data: bookingsData,
    error: bookingsError,
    loading: bookingsLoading,
  } = useGetBookingsQuery();
  return (
    <>
      <DefaultLayout>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={12} md={7} lg={9}>
            <Link href="/news">
              <h2>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  href="/news"
                >
                  {t('news')}
                </a>
              </h2>
            </Link>{' '}
            <ArticleSet fullArticles={false} articlesPerPage={10} />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={3}>
            <Link href="/calendar">
              <h2>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  href="/calendar"
                >
                  {t('calendar')}
                </a>
              </h2>
            </Link>
            <Paper>
              {!eventsLoading &&
                !bookingsLoading &&
                !eventsError &&
                !bookingsError && (
                  <SmallCalendar
                    events={eventsData.events}
                    bookings={bookingsData.bookingRequests}
                  />
                )}{' '}
            </Paper>
          </Grid>
        </Grid>
      </DefaultLayout>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'calendar'])),
  },
});
