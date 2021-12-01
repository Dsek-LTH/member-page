import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useEventsQuery, useNewsPageInfoQuery } from '~/generated/graphql';
import ArticleSet from '~/components/News/articleSet';
import NewsStepper from '~/components/News/newsStepper';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EventSet from '~/components/Calendar/EventSet';

export default function EventsPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const { t } = useTranslation('common');

  const { loading, data } = useEventsQuery();

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(router.asPath).get('page');
    const pageNumber = parseInt(pageNumberParameter) || 0;
    setPageIndex(pageNumber);
  }, [router.pathname]);

  if (!data?.events) return <p></p>;

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

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
