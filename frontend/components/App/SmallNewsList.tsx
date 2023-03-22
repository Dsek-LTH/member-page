import { Stack, Typography } from '@mui/material';
import { SmallArticle } from '~/components/News/article';
import { useNewsPageQuery } from '~/generated/graphql';

function SmallNewsList() {
  const { data } = useNewsPageQuery({
    variables: { page_number: 0, per_page: 3 },
    pollInterval: 60000,
  });
  const articles = data?.news?.articles ?? [];

  return (
    <Stack gap={1}>
      <Typography variant="h6" fontWeight="bold">Senaste nyheterna</Typography>
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
