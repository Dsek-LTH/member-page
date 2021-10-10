import React from 'react';
import ArticleSet from '../components/News/articleSet';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { Paper, Link } from '@mui/material';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '../layouts/defaultLayout';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';
import routes from '~/routes';

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
            <NextLink href="/news">
              <h2>
                <Link style={{ color: 'inherit' }} href="/news">
                  {t('news')}
                </Link>
              </h2>
            </NextLink>
            <ArticleSet fullArticles={false} articlesPerPage={10} />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={3}>
            <NextLink href={routes.calendar}>
              <h2>
                <Link style={{ color: 'inherit' }} href={routes.calendar}>
                  {t('calendar')}
                </Link>
              </h2>
            </NextLink>
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
