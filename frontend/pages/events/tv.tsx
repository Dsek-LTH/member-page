import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TVWrapper from '~/components/TV/TVWrapper';
import EventsPage from '.';

function EventsTVPage() {
  return (
    <TVWrapper>
      <EventsPage />
    </TVWrapper>
  );
}

EventsTVPage.tv = true;

export default EventsTVPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
