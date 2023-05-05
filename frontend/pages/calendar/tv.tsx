import
{
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import BigCalendar from '~/components/Calendar/BigCalendar';
import TVWrapper from '~/components/TV/TVWrapper';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

function CalendarTVPage() {
  const { t } = useTranslation('common');
  useSetPageName(t('calendar'));

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

export const getStaticProps = genGetProps([
  'event',
  'booking',
  'calendar',
]);
