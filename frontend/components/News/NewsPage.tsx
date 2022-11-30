import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Grid, Stack, IconButton, Button,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useRouter } from 'next/router';
import ArticleSet from '~/components/News/articleSet';
import routes from '~/routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NewsFilter from './NewsFilter';
import ArticleSearchInput from './ArticleSearchInput';

const articlesPerPage = 5;

export default function NewsPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const { t } = useTranslation('common');
  const apiContext = useApiAccess();

  const handleTagChange = (updated: string[]) => {
    if (window.history.pushState) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('tags', JSON.stringify(updated));
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({ path: newurl }, '', newurl);
    }
    setTagIds(updated);
  };

  useEffect(() => {
    if (global?.location?.search) {
      const searchParams = new URLSearchParams(window.location.search);
      setTagIds(JSON.parse(searchParams.get('tags') || '[]'));
    }
  }, [global?.location?.search]);

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(window.location.href).get('page');
    const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter, 10) : 0;
    setPageIndex(pageNumber);
  }, []);

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
        <NewsFilter tagIds={tagIds} setTagIds={handleTagChange} />
        <ArticleSet
          articlesPerPage={articlesPerPage}
          pageIndex={pageIndex}
          tagIds={tagIds}
        />
      </Grid>
    </Grid>
  );
}
