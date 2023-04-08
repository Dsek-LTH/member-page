import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Link from '~/components/Link';
import ArticleRequest from '~/components/News/ArticleRequest';
import genGetProps from '~/functions/genGetServerSideProps';
import { useArticleRequestsQuery } from '~/generated/graphql';
import routes from '~/routes';

export default function ArticleRequests() {
  const { t } = useTranslation('common');
  const { data, refetch } = useArticleRequestsQuery({

  });

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="baseline">
        <h2>{t('news')}</h2>
        <Link href={routes.rejectedRequests}>
          Rejected
        </Link>
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
