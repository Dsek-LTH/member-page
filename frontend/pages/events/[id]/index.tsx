import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { KeycloakInstance } from 'keycloak-js';
import { useKeycloak } from '@react-keycloak/ssr';
import { useEventQuery } from '~/generated/graphql';
import Article from '~/components/News/article';
import ArticleLayout from '~/layouts/articleLayout';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { getFullName } from '~/functions/memberFunctions';
import EventCard from '~/components/Calendar/EventCard';

export default function EventPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useEventQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 },
  });
  const { t } = useTranslation(['common', 'news']);

  if (loading || !initialized) {
    return (
      <ArticleLayout>
        <ArticleSkeleton />
      </ArticleLayout>
    );
  }

  if (!data) {
    return <ArticleLayout>{t('articleError')}</ArticleLayout>;
  }

  return (
    <ArticleLayout>
      <EventCard event={data.event} />
    </ArticleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news', 'event'])),
    },
  };
}
