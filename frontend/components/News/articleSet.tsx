import React from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import ArticleSkeleton from './articleSkeleton';

type newsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  fullArticles?: boolean;
};

export default function ArticleSet({
  pageIndex = 0,
  articlesPerPage = 10,
  fullArticles = true,
}: newsPageProps) {
  const { loading, data, refetch } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage },
  });
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('news');

  if (loading || !initialized) {
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

  if (!data?.news) return <p>{t('failedLoadingNews')}</p>;

  return (
    <div>
      {data.news.articles.map((article) =>
        (article ? (
          <Article
            key={article.id}
            refetch={refetch}
            article={article}
            fullArticle={fullArticles}
          />
        ) : (
          <div>{t('articleError')}</div>
        )))}
    </div>
  );
}
