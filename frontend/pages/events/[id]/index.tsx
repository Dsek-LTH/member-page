import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import EventPage from '~/components/Calendar/EventPage';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrSlug } from '~/functions/isUUID';
import selectTranslation from '~/functions/selectTranslation';
import { useEventQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function EventPageComponent() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data, refetch } = useEventQuery({
    variables: idOrSlug(id),
  });
  const { t } = useTranslation(['common', 'news']);
  const EVENT_TITLE = selectTranslation(i18n, 'Evenemang', 'Event');
  useSetPageName(data?.event?.title ?? EVENT_TITLE, EVENT_TITLE);

  if (loading) {
    return (
      <NoTitleLayout>
        <ArticleSkeleton />
        {' '}
      </NoTitleLayout>
    );
  }

  if (!data) {
    return <>{t('news:eventError.missing')}</>;
  }

  return (
    <NoTitleLayout>
      <EventPage event={data.event} refetch={refetch} />
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news', 'event']);
