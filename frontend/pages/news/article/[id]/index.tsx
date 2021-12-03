import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useArticleQuery } from '~/generated/graphql';
import Article from '~/components/News/article';
import { useRouter } from 'next/router';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { getFullName } from '~/functions/memberFunctions';
import { selectTranslation } from '~/functions/selectTranslation';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function ArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useArticleQuery({
    variables: { id: id },
  });

  const { t, i18n } = useTranslation(['common', 'news']);

  if (loading || !initialized) {
    return (
      <NoTitleLayout>
        <ArticleSkeleton />
      </NoTitleLayout>
    );
  }

  const article = data?.article;

  if (!article) {
    return <NoTitleLayout>{t('articleError')}</NoTitleLayout>;
  }

  return (
    <NoTitleLayout>
      <Article
        title={selectTranslation(i18n, article.header, article.headerEn)}
        publishDate={article.publishedDatetime}
        imageUrl={article.imageUrl}
        author={getFullName(article.author)}
        authorId={article.author.id}
        id={article.id.toString()}
        fullArticle={true}
      >
        {selectTranslation(i18n, article.body, article.bodyEn)}
      </Article>
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
