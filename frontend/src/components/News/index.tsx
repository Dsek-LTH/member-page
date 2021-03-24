import React from 'react';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';

type newsPageProps = {

  page_index?: number,
  articles_per_page?: number,
  full_articles?: boolean,
}

export default function ArticleSet({ page_index = 0, articles_per_page = 10, full_articles = true }: newsPageProps) {

  const { loading, data } = useNewsPageQuery({
    variables: { page_number: page_index, per_page: articles_per_page }
  });

  if (loading)
    return (<p>laddar nyheter...</p>)

  return (
    <div>
      {data ? (
        data.news?.articles.map(article => (article) ? (
          <article key={article.id}>
            <Article
              title={article.header}
              publish_date={article.published_datetime}
              image_url={undefined}
              author={`${article.author.first_name} ${article.author.last_name}`}
              id={article.id.toString()}
              full_article={full_articles}>
              {article.body}
            </Article>
          </article>
        )
          : (<div>Trasig nyhet</div>))
      ) : (
          <p>Misslyckades med att hämta nyheterna</p>
        )}
    </div>
  )
}