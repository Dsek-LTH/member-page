import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Grid, Stack, IconButton, Button,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useRouter } from 'next/router';
import { useNewsPageInfoQuery } from '~/generated/graphql';
import ArticleSet from '~/components/News/articleSet';
import NewsStepper from '~/components/News/NewsStepper';
import routes from '~/routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

const articlesPerPage = 10;

export default function NewsPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const { t } = useTranslation('common');
  const { data } = useNewsPageInfoQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage },
  });
  const apiContext = useApiAccess();

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(window.location.href).get('page');
    const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter, 10) : 0;
    setPageIndex(pageNumber);
  }, []);

  const totalPages = data?.news?.pageInfo?.totalPages || 1;

  const goBack = () => {
    router.push(`/news?page=${pageIndex - 1}`);
    setPageIndex((oldPageIndex) => oldPageIndex - 1);
  };

  const goForward = () => {
    router.push(`/news?page=${pageIndex + 1}`);
    setPageIndex((oldPageIndex) => oldPageIndex + 1);
  };

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Stack direction="row" spacing={1} alignItems="center">
          <h2>{t('news')}</h2>
          {hasAccess(apiContext, 'news:article:create') && (
            <IconButton
              onClick={() => router.push(routes.createArticle)}
              style={{ height: 'fit-content' }}
            >
              <ControlPointIcon />
            </IconButton>
          )}
          {hasAccess(apiContext, 'tags:update') && hasAccess(apiContext, 'tags:create') && (
            <Button
              onClick={() => router.push(routes.newsAdmin)}
              style={{ height: 'fit-content' }}
            >
              {t('admin')}
            </Button>
          )}
        </Stack>
        <ArticleSet
          fullArticles
          articlesPerPage={articlesPerPage}
          pageIndex={pageIndex}
        />
        <NewsStepper
          pages={totalPages}
          index={pageIndex}
          onForwardClick={goForward}
          onBackwardClick={goBack}
        />
      </Grid>
    </Grid>
  );
}
