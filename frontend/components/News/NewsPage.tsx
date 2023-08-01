import { Grid, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import NewsPageHeader from '~/components/News/NewsPageHeader';
import ArticleSet from '~/components/News/articleSet';
import { useNewsPageQuery } from '~/generated/graphql';
import routes from '~/routes';
import ArticleSearchInput from './ArticleSearchInput';
import NewsFilter from './NewsFilter';

export const articlesPerPage = 10;

export default function NewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currentPage = parseInt(router.query.page as string, 10) || 1;
  const currentTags = router.query.tags ? (router.query.tags as string).split(',') : [];
  const { data } = useNewsPageQuery({
    variables: {
      page_number: currentPage,
      per_page: articlesPerPage,
      tagIds: currentTags,
      showAll: router.query.showAll === 'true',
    },
  });

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
        <NewsPageHeader />

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
          showAll={router.query.showAll === 'true'}
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
