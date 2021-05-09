import React from 'react';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import { useTranslation } from 'next-i18next';
import ArticleSkeleton from './articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';

type newsPageProps = {
  pageIndex?: number,
  articlesPerPage?: number,
  fullArticles?: boolean,
}

export default function ArticleSet({ pageIndex = 0, articlesPerPage = 10, fullArticles = true }: newsPageProps) {

  const { loading, data } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage }
  });
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t, i18n} = useTranslation('news');

  if (loading || !initialized)
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    )

  if (!data?.news)
    return (<p>{t('failedLoadingNews')}</p>)

 const english = i18n.language === "en";

  return (
    <div>
      {
        data.news.articles.map(article => (article) ? (
          <article key={article.id}>
            <Article
              title={english && article.header_en? article.header_en: article.header}
              publishDate={article.published_datetime}
              imageUrl={undefined}
              author={`${article.author.first_name} ${article.author.last_name}`}
              authorId={article.author.id}
              id={article.id.toString()}
              fullArticle={fullArticles}>
              {english && article.body_en ? article.body_en: article.body}
            </Article>
          </article>
        )
          : (<div>{t('articleError')}</div>))
      }
    </div>
  )
}