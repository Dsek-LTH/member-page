import React from 'react';
import ArticleSet from '../components/News/articleSet';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Paper, Link as MuiLink } from '@mui/material';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '../layouts/defaultLayout';
import {
  useEventsQuery,
  useGetBookingsQuery,
  NewsPageDocument,
  EventsDocument,
  GetBookingsDocument,
} from '~/generated/graphql';
import routes from '~/routes';
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '~/apolloClient';
import isCsrNavigation from '~/functions/isCSRNavigation';

export async function getServerSideProps({ locale, req }) {
  const client = initializeApollo();
  if (!isCsrNavigation(req)) {
    await client.query({
      query: NewsPageDocument,
      variables: { page_number: 0, per_page: 10 },
    });
    await client.query({
      query: EventsDocument,
    });
    await client.query({
      query: GetBookingsDocument,
    });
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar'])),
      [APOLLO_STATE_PROP_NAME]: client.cache.extract(),
    },
  };
}

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
                <MuiLink style={{ color: 'inherit' }} href="/news">
                  {t('news')}
                </MuiLink>
              </h2>
            </Link>
            <ArticleSet fullArticles={false} articlesPerPage={10} />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={3}>
            <Link href={routes.calendar}>
              <h2>
                <MuiLink style={{ color: 'inherit' }} href={routes.calendar}>
                  {t('calendar')}
                </MuiLink>
              </h2>
            </Link>
            <Paper>
              {eventsData && bookingsData && (
                <SmallCalendar
                  events={eventsData.events}
                  bookings={bookingsData.bookingRequests}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </DefaultLayout>
    </>
  );
}
