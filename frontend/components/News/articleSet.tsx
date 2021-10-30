import React from 'react';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import { useTranslation } from 'next-i18next';
import ArticleSkeleton from './articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { getFullName } from '~/functions/memberFunctions';
import { selectTranslation } from '~/functions/selectTranslation';

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
  const { loading, data } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage },
  });
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t, i18n } = useTranslation('news');

  if (loading || !initialized)
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    );

  if (!data?.news) return <p>{t('failedLoadingNews')}</p>;

  return (
    <div>
      {data.news.articles.map((article) =>
        article ? (
          <div key={article.id}>
            <Article
              title={selectTranslation(i18n, article.header, article.headerEn)}
              publishDate={article.publishedDatetime}
              imageUrl={article.imageUrl}
              author={getFullName(article.author)}
              authorId={article.author.id}
              id={article.id.toString()}
              fullArticle={fullArticles}
            >
              {selectTranslation(i18n, article.body, article.bodyEn)}
            </Article>
          </div>
        ) : (
          <div>{t('articleError')}</div>
        )
      )}
    </div>
  );
}
