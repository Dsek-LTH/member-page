import React from 'react';
import { useTranslation } from 'next-i18next';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import ArticleSkeleton from './articleSkeleton';

type NewsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  tagIds?: string[];
};

export default function ArticleSet({
  pageIndex = 0,
  articlesPerPage = 10,
  tagIds = [],
}: NewsPageProps) {
  const { error, data, refetch } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage, tagIds },
  });
  const { t } = useTranslation('news');

  if (!data?.news) {
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

  if (error) return <p>{t('failedLoadingNews')}</p>;

  return (
    <div>
      {data.news.articles.map((article) =>
        (article ? (
          <Article
            key={article.id}
            refetch={refetch}
            article={article}
          />
        ) : (
          <div>{t('articleError')}</div>
        )))}
    </div>
  );
}
