import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Paper,
} from '@mui/material';
import TVWrapper from '~/components/TV/TVWrapper';
import BigCalendar from '~/components/Calendar/BigCalendar';

function CalendarTVPage() {
  return (
    <TVWrapper>
      <Paper style={{ padding: '0.5rem' }}>
        <BigCalendar hideToolbar bookingsEnabled />
      </Paper>
    </TVWrapper>
  );
}

CalendarTVPage.tv = true;

export default CalendarTVPage;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'event',
      'booking',
      'calendar',
    ])),
  },
});
