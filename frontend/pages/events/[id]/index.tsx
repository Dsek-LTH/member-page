import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import EventPage from '~/components/Calendar/EventPage';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrSlug } from '~/functions/isUUID';
import { useEventQuery } from '~/generated/graphql';

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

export const getServerSideProps = genGetProps(['news', 'event']);
