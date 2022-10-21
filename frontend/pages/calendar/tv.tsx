import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TVWrapper from '~/components/TV/TVWrapper';
import CalendarPage from '.';

function CalendarTVPage() {
  return (
    <TVWrapper>
      <CalendarPage />
    </TVWrapper>
  );
}

CalendarTVPage.tv = true;

export default CalendarTVPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'event',
      'booking',
      'calendar',
    ])),
  },
});
