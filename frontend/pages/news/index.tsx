import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useNewsPageInfoQuery } from '~/generated/graphql';
import ArticleSet from '~/components/News/articleSet';
import NewsStepper from '~/components/News/newsStepper';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const articlesPerPage = 10;

export default function NewsPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const { t } = useTranslation('common');

  const { loading, data } = useNewsPageInfoQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage },
  });

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(router.asPath).get('page');
    const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter) : 0;
    setPageIndex(pageNumber);
  }, [router.pathname]);

  const totalPages = data?.news?.pageInfo?.totalPages || 1;

  const goBack = () => {
    router.push('/news?page=' + (pageIndex - 1));
    setPageIndex((oldPageIndex) => oldPageIndex - 1);
  };

  const goForward = () => {
    router.push('/news?page=' + (pageIndex + 1));
    setPageIndex((oldPageIndex) => oldPageIndex + 1);
  };

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <h2>{t('news')}</h2>
        <ArticleSet
          fullArticles={true}
          articlesPerPage={articlesPerPage}
          pageIndex={pageIndex}
        />
        <NewsStepper
          pages={totalPages}
          index={pageIndex}
          onForwardClick={goForward}
          onbackwardClick={goBack}
        />
      </Grid>
    </Grid>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'news'])),
  },
});
