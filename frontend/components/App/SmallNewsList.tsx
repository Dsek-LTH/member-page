import { Stack, Typography } from '@mui/material';
import { SmallArticle } from '~/components/News/article';
import { SmallArticleSkeleton } from '~/components/News/articleSkeleton';
import { useNewsPageQuery } from '~/generated/graphql';

function SmallNewsList() {
  const { data, loading } = useNewsPageQuery({
    variables: { page_number: 0, per_page: 5 },
    pollInterval: 60000,
  });
  const articles = data?.news?.articles ?? [];

  return (
    <Stack gap={1}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Senaste nyheterna</Typography>
      {loading && (
        <>
          <SmallArticleSkeleton />
          <SmallArticleSkeleton />
          <SmallArticleSkeleton />
          <SmallArticleSkeleton />
          <SmallArticleSkeleton />
        </>
      )}
      {articles.map((article) => (
        <SmallArticle
          key={article.id}
          article={article}
        />
      ))}

    </Stack>
  );
}

export default SmallNewsList;
