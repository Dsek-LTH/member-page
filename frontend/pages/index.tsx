import React from 'react';
import ArticleSet from '../components/News/articleSet';
import Grid from '@material-ui/core/Grid';
import SmallCalendar from '../components/Calendar/SmallCalendar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import DefaultLayout from '../layouts/defaultLayout';
import BigCalendar from '~/components/Calendar/BigCalendar';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';

export default function HomePage() {
  const { t } = useTranslation('common');
  const { data: eventsData, loading: eventsLoading } = useEventsQuery();
  const { data: bookingsData, loading: bookingsLoading } =
    useGetBookingsQuery();
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
          <Grid item xs={12} sm={12} md={12} lg={9}>
            <h2>{t('news')}</h2>
            <ArticleSet fullArticles={false} articlesPerPage={10} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3}>
            <h2>{t('calendar')}</h2>
            {!eventsLoading && !bookingsLoading && (
              <BigCalendar
                events={eventsData.events}
                bookings={bookingsData.bookingRequests}
              />
            )}{' '}
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
