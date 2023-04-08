import { Pagination, Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleRequest from '~/components/News/ArticleRequest';
import genGetProps from '~/functions/genGetServerSideProps';
import { useRejectedRequestsQuery } from '~/generated/graphql';

export default function ArticleRequests() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);
  const { data } = useRejectedRequestsQuery({
    variables: { page, perPage: 10 },
  });
  const requests = data?.rejectedRequests?.articles;
  const { totalPages } = data?.rejectedRequests?.pageInfo ?? {};

  return (
    <Stack>
      <Stack direction="row" spacing={2} alignItems="baseline">
        <h2>{t('news:rejectedRequests')}</h2>
      </Stack>
      {requests?.map((article) =>
        (article ? (
          <ArticleRequest
            key={article.id}
            article={article}
            rejected
          />
        ) : (
          <div>{t('articleError')}</div>
        )))}
      <Pagination
        page={page}
        count={totalPages}
        onChange={(_, p) => {
          setPage(p);
        }}
      />
    </Stack>
  );
}

export const getStaticProps = genGetProps(['news']);
