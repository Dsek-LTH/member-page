import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArticleRequest from '~/components/News/ArticleRequest';
import genGetProps from '~/functions/genGetServerSideProps';
import { useArticleRequestsQuery } from '~/generated/graphql';

export default function ArticleRequests() {
  const { t } = useTranslation('common');
  const { data, refetch } = useArticleRequestsQuery({

  });
  console.log(data);

  return (
    <Stack>
      <Stack direction="row" spacing={2} alignItems="baseline">
        <h2>{t('news')}</h2>
      </Stack>
      {data?.articleRequests?.map((article) =>
        (article ? (
          <ArticleRequest
            key={article.id}
            refetch={refetch}
            article={article}
          />
        ) : (
          <div>{t('articleError')}</div>
        )))}
    </Stack>
  );
}

export const getStaticProps = genGetProps(['news']);
