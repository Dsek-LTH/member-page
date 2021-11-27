import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { KeycloakInstance } from 'keycloak-js';
import { useKeycloak } from '@react-keycloak/ssr';
import { useEventQuery } from '~/generated/graphql';
import Article from '~/components/News/article';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { getFullName } from '~/functions/memberFunctions';
import EventCard from '~/components/Calendar/EventCard';

export default function EventPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useEventQuery({
    variables: { id: id },
  });
  const { t } = useTranslation(['common', 'news']);

  if (loading || !initialized) {
    return <ArticleSkeleton />;
  }

  if (!data) {
    return <>{t('articleError')}</>;
  }

  return <EventCard event={data.event} />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news', 'event'])),
    },
  };
}
