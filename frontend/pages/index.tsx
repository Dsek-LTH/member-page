import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Link as MuiLink } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DateTime } from 'luxon';
import routes from '~/routes';
import { Grid, Stack, IconButton } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useEventsQuery } from '~/generated/graphql';
import ArticleSet from '../components/News/articleSet';
import { useRouter } from 'next/router';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import EventSet from '~/components/Events/EventSet';

const now = DateTime.now();

const HomePage = function () {
  const { data } = useEventsQuery({
    variables: { start_datetime: now },
  });
  const upcomingEventsExist = data?.events?.events.length > 0;
  const router = useRouter();
  const { t } = useTranslation('common');
  const apiContext = useApiAccess();
  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={upcomingEventsExist ? 7 : 12}
        lg={upcomingEventsExist ? 9 : 12}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Link href={routes.news}>
            <h2>
              <MuiLink style={{ color: 'inherit' }} href="/news">
                {t('news')}
              </MuiLink>
            </h2>
          </Link>{' '}
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
        {upcomingEventsExist && (
          <>
            <Link href={routes.calendar}>
              <h2>
                <MuiLink style={{ color: 'inherit' }} href={routes.calendar}>
                  {t('happening_soon')}
                </MuiLink>
              </h2>
            </Link>
            <EventSet small />
          </>
        )}
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
