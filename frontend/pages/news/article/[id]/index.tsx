import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useArticleQuery } from '~/generated/graphql';
import Article from '~/components/News/article';
import { useRouter } from 'next/router';
import ArticleLayout from '~/layouts/articleLayout';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { getFullName } from '~/functions/memberFunctions';

export default function ArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 },
  });

  const { t } = useTranslation(['common', 'news']);
  console.log(data);

  if (loading || !initialized) {
    return (
      <ArticleLayout>
        <ArticleSkeleton />
      </ArticleLayout>
    );
  }

  const article = data?.article;

  if (!article) {
    return <ArticleLayout>{t('articleError')}</ArticleLayout>;
  }

  return (
    <ArticleLayout>
      <Article
        title={article.header}
        publishDate={article.publishedDatetime}
        imageUrl={article.imageUrl}
        author={getFullName(article.author)}
        authorId={article.author.id}
        id={article.id.toString()}
        fullArticle={true}
      >
        {article.body}
      </Article>
    </ArticleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
