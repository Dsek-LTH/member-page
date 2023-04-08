import AddIcon from '@mui/icons-material/Add';
import
{
  Badge,
  Button,
  Grid,
  Pagination,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { request } from 'http';
import ArticleSet from '~/components/News/articleSet';
import { useArticleRequestsQuery, useNewsPageQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import ArticleSearchInput from './ArticleSearchInput';
import NewsFilter from './NewsFilter';

export const articlesPerPage = 10;

export default function NewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const currentPage = parseInt(router.query.page as string, 10) || 1;
  const currentTags = router.query.tags ? (router.query.tags as string).split(',') : [];
  const { data } = useNewsPageQuery({
    variables: { page_number: currentPage, per_page: articlesPerPage, tagIds: currentTags },
  });
  const { data: requests } = useArticleRequestsQuery({

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
        <Stack direction="row" spacing={2} alignItems="baseline">
          <h2>{t('news')}</h2>
          {hasAccess(apiContext, 'news:article:create') && (
            <Button
              onClick={() => router.push(routes.createArticle)}
              style={{ height: 'fit-content' }}
              variant="outlined"
            >
              {t('news:new_article')}
              <AddIcon style={{ marginLeft: '0.25rem' }} />
            </Button>
          )}
          {hasAccess(apiContext, 'tags:update') && hasAccess(apiContext, 'tags:create') && (
            <Button
              onClick={() => router.push(routes.tags)}
              style={{ height: 'fit-content' }}
              variant="outlined"
            >
              {t('news:tags')}
            </Button>
          )}
          {(hasAccess(apiContext, 'news:article:manage') || requests?.articleRequests?.length > 0) && (
            <Badge
              badgeContent={(requests?.articleRequests?.length ?? 0) === 0
                ? undefined
                : requests?.articleRequests?.length}
              color="primary"
            >
              <Button
                onClick={() => router.push(routes.articleRequests)}
                style={{ height: 'fit-content' }}
                variant="outlined"
              >
                {t('news:requests')}
              </Button>

            </Badge>
          )}
        </Stack>
        <div style={{ marginBottom: '1rem' }}>
          <ArticleSearchInput onSelect={(slug, id) => router.push(routes.article(slug || id))} />
        </div>
        <NewsFilter
          tagIds={currentTags}
          setTagIds={(newTags) => {
            setLoading(true);
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
            setLoading(true);
            router.push(`?page=${page}&tags=${currentTags}`);
          }}
        />
      </Grid>
    </Grid>
  );
}
