import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { KeycloakInstance } from 'keycloak-js';
import { useKeycloak } from '@react-keycloak/ssr';
import { useEventQuery } from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import EventPage from '~/components/Calendar/EventPage';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function EventPageComponent() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useEventQuery({
    variables: { id },
  });
  const { t } = useTranslation(['common', 'news']);

  if (loading || !initialized) {
    return (
      <NoTitleLayout>
        <ArticleSkeleton />
        {' '}
      </NoTitleLayout>
    );
  }

  if (!data) {
    return <>{t('articleError')}</>;
  }

  return (
    <NoTitleLayout>
      <EventPage event={data.event} />
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news', 'event'])),
    },
  };
}
