import React from 'react';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Paper, Link as MuiLink } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ArticleSet from '../components/News/articleSet';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';
import routes from '~/routes';

const HomePage = function () {
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
          {eventsData &&
            !eventsLoading &&
            !bookingsLoading &&
            !eventsError &&
            !bookingsError && (
              <SmallCalendar
                events={eventsData.events.events}
                bookings={bookingsData.bookingRequests}
              />
            )}{' '}
        </Paper>
      </Grid>
    </Grid>
  );
};
export default HomePage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
  },
});
