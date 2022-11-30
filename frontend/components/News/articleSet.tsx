import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress, Stack } from '@mui/material';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import ArticleSkeleton from './articleSkeleton';

type NewsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  tagIds?: string[];
};

function Loading() {
  return (
    <>
      <ArticleSkeleton />
      <ArticleSkeleton />
      <ArticleSkeleton />
      <ArticleSkeleton />
      <ArticleSkeleton />
    </>
  );
}

export default function ArticleSet({
  pageIndex = 0,
  articlesPerPage = 5,
  tagIds = [],
}: NewsPageProps) {
  const [page, setPage] = useState(pageIndex);
  const { error, data, refetch } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage, tagIds },
  });
  const { t } = useTranslation('news');
  const [articles, setArticles] = useState(data?.news?.articles || []);

  useEffect(() => {
    refetch({
      page_number: page,
      per_page: articlesPerPage,
      tagIds,
    }).then((result) => {
      if (result.data?.news?.articles) {
        if (page === 0) {
          setArticles(result.data.news.articles);
        } else {
          setArticles((prev) => [...prev, ...result.data.news.articles]);
        }
      }
    });
  }, [page, tagIds]);

  if (!articles.length) {
    return <Loading />;
  }

  if (error) return <p>{t('failedLoadingNews')}</p>;

  return (
    <InfiniteScroll
      dataLength={articles.length} // This is important field to render the next data
      next={() => {
        setPage(page + 1);
      }}
      hasMore={(data?.news?.pageInfo.totalPages || 0) - 1 > page || false}
      loader={(
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      endMessage={(
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      )}
      refreshFunction={refetch}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      }
    >
      {articles.map((article) => (
        <Article
          key={article.id}
          refetch={refetch}
          article={article}
        />
      ))}
    </InfiniteScroll>
  );
}
