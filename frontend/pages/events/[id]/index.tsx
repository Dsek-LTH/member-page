import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEventQuery } from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import EventPage from '~/components/Calendar/EventPage';
import NoTitleLayout from '~/components/NoTitleLayout';
import { idOrSlug } from '~/functions/isUUID';

export default function EventPageComponent() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data, refetch } = useEventQuery({
    variables: idOrSlug(id),
  });
  const { t } = useTranslation(['common', 'news']);

  if (loading) {
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
      <EventPage event={data.event} refetch={refetch} />
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
