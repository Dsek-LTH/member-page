import React from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useArticleQuery } from '../../../generated/graphql';
import Article from '../../../components/News/article';
import { useRouter } from 'next/router'

import ArticleLayout from '../../../layouts/articleLayout';

export default function ArticlePage(props) {
  const router = useRouter()
  const id = router.query.id as string;

  const { loading, data } = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const { t } = useTranslation(['common', 'news']);
  const article = data?.article;

  if (loading) {
    return (
      <p>{t('loadingArticle')}</p>
    )
  }

  if (!article) {
    return (
      <p></p>
    )
  }

  return (
    <ArticleLayout>
      <article>
        <Article
          title={article.header}
          publishDate={article.published_datetime}
          imageUrl={undefined}
          author={`${article.author.first_name} ${article.author.last_name}`}
          id={article.id.toString()}
          fullArticle={true} >
          {article.body}
        </Article>
      </article>
    </ArticleLayout>
  )
}

export const getStaticProps = async ({ locale }) => {
  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'header', 'news']),
    }
  });
}

export const getStaticPaths = ({ locales }) => {
  return {
    paths: [
    ],
    fallback: true,
  }
}