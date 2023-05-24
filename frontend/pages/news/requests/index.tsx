import { Box, Pagination, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import ArticleRequest from '~/components/News/ArticleRequest';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useArticleRequestsQuery, useRejectedRequestsQuery } from '~/generated/graphql';

export default function ArticleRequests() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);
  const { data: drafts, refetch: refetchDrafts } = useArticleRequestsQuery({

  });
  const { data: rejected, refetch: refetchRejected } = useRejectedRequestsQuery({
    variables: { page, perPage: 10 },
  });

  const activeRequests = drafts?.articleRequests;
  const rejectedRequests = rejected?.rejectedRequests?.articles;
  const { totalPages } = rejected?.rejectedRequests?.pageInfo ?? {};

  const refetch = () => {
    refetchDrafts();
    refetchRejected();
  };

  return (
    <Stack>
      <PageHeader>{t('news:activeRequests')}</PageHeader>
      {activeRequests?.map((article) =>
        (article ? (
          <ArticleRequest
            key={article.id}
            article={article}
            refetch={refetch}
          />
        ) : (
          <div>{t('articleError')}</div>
        )))}
      {activeRequests?.length === 0 && (
        <Box sx={{ mb: 2 }}>{t('news:noActiveRequests')}</Box>
      )}
      <PageHeader>{t('news:rejectedRequests')}</PageHeader>
      {rejectedRequests?.map((article) =>
        (article ? (
          <ArticleRequest
            key={article.id}
            article={article}
            refetch={refetch}
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
