import { useTranslation } from 'next-i18next';
import TVWrapper from '~/components/TV/TVWrapper';
import genGetProps from '~/functions/genGetServerSideProps';
import EventsPage from '.';
import { useSetPageName } from '~/providers/PageNameProvider';

function EventsTVPage() {
  const { t } = useTranslation();
  useSetPageName(t('upcomingEvents'));
  return (
    <TVWrapper>
      <EventsPage />
    </TVWrapper>
  );
}

EventsTVPage.tv = true;

export default EventsTVPage;

export const getStaticProps = genGetProps(['event']);
