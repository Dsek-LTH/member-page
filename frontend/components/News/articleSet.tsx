import React from 'react';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import { useTranslation } from 'next-i18next';

type newsPageProps = {
  pageIndex?: number,
  articlesPerPage?: number,
  fullArticles?: boolean,
}

export default function ArticleSet({ pageIndex = 0, articlesPerPage = 10, fullArticles = true }: newsPageProps) {

  const { loading, data } = useNewsPageQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage }
  });
  const { t } = useTranslation('news');

  if (loading)
    return (<p>{t('loadingNews')}</p>)

  if (!data?.news)
    return (<p>{t('failedLoadingNews')}</p>)

  return (
    <div>
      {
        data.news.articles.map(article => (article) ? (
          <article key={article.id}>
            <Article
              title={article.header}
              publishDate={article.published_datetime}
              imageUrl={undefined}
              author={`${article.author.first_name} ${article.author.last_name}`}
              id={article.id.toString()}
              fullArticle={fullArticles}>
              {article.body}
            </Article>
          </article>
        )
          : (<div>{t('articleError')}</div>))
      }
    </div>
  )
}