import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
  Paper, Link as MuiLink, Grid, Stack, IconButton,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useRouter } from 'next/router';
import routes from '~/routes';
import ArticleSet from '../components/News/articleSet';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

function HomePage() {
  const router = useRouter();
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

  const apiContext = useApiAccess();

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={7} lg={9}>
        <Stack direction="row" spacing={1} alignItems="center">
          <h2>
            <Link href={routes.news} passHref>
              <MuiLink style={{ color: 'inherit' }}>
                {t('news')}
              </MuiLink>
            </Link>
          </h2>
          {' '}
          {hasAccess(apiContext, 'news:article:create') && (
            <IconButton
              onClick={() => router.push(routes.createArticle)}
              style={{ height: 'fit-content' }}
            >
              <ControlPointIcon />
            </IconButton>
          )}
        </Stack>
        <ArticleSet fullArticles={false} articlesPerPage={10} />
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={3}>
        <Link href={routes.calendar} passHref>
          <h2>
            <MuiLink style={{ color: 'inherit' }} href={routes.calendar}>
              {t('calendar')}
            </MuiLink>
          </h2>
        </Link>
        <Paper>
          {eventsData
            && !eventsLoading
            && !bookingsLoading
            && !eventsError
            && !bookingsError && (
              <SmallCalendar
                events={eventsData.events.events}
                bookings={bookingsData.bookingRequests}
              />
          )}
          {' '}
        </Paper>
      </Grid>
    </Grid>
  );
}
export default HomePage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
  },
});
