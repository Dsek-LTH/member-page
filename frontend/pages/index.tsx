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
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { createApolloServerClient } from '~/apolloClient';
import isCsrNavigation from '~/functions/isCSRNavigation';
import {
  MeHeaderDocument, MeHeaderQuery,
  NewsPageDocument, ApiAccessDocument,
  NotificationsQuery, NotificationsDocument,
} from '~/generated/graphql';

const articlesPerPage = 5;

function HomePage() {
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
        <ArticleSet articlesPerPage={articlesPerPage} />
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
          <SmallCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
}
export default HomePage;

export async function getServerSideProps({ locale, req }) {
  const client = await createApolloServerClient(req);
  if (!isCsrNavigation(req)/*  && process.env.NODE_ENV !== 'development' */) {
    const queries: Promise<any>[] = [];
    queries.push(client.query({
      query: NewsPageDocument,
      variables: { page_number: 0, per_page: articlesPerPage, tagIds: [] },
    }));
    queries.push(client.query<MeHeaderQuery>({
      query: MeHeaderDocument,
    }));
    queries.push(client.query<MeHeaderQuery>({
      query: ApiAccessDocument,
    }));
    queries.push(client.query<NotificationsQuery>({
      query: NotificationsDocument,
    }));
    await Promise.all(queries);
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
      apolloCache: client.cache.extract(),
    },
  };
}
