import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Grid, Stack, IconButton, Button, Pagination,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useRouter } from 'next/router';
import { useNewsPageQuery } from '~/generated/graphql';
import ArticleSet from '~/components/News/articleSet';
import routes from '~/routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NewsFilter from './NewsFilter';
import ArticleSearchInput from './ArticleSearchInput';

const articlesPerPage = 5;

export default function NewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const currentPage = parseInt(router.query.page as string, 10) || 1;
  const currentTags = router.query.tags ? (router.query.tags as string).split(',') : [];
  const { data } = useNewsPageQuery({
    variables: { page_number: currentPage, per_page: articlesPerPage, tagIds: currentTags },
  });
  const apiContext = useApiAccess();

  const totalPages = data?.news?.pageInfo?.totalPages || 1;

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
        <div style={{ marginBottom: '1rem' }}>
          <ArticleSearchInput onSelect={(slug, id) => router.push(routes.article(slug || id))} />
        </div>
        <NewsFilter
          tagIds={currentTags}
          setTagIds={(newTags) => {
            router.push(`?tags=${newTags}`);
          }}
        />
        <ArticleSet
          articlesPerPage={articlesPerPage}
          pageIndex={currentPage}
          tagIds={currentTags}
          loading={loading}
          setLoading={setLoading}
        />
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={(_, page) => {
            router.push(`?page=${page}&tags=${currentTags}`);
          }}
        />
      </Grid>
    </Grid>
  );
}
