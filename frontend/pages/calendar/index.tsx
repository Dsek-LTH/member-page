import
{
  Paper,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import BigCalendar from '~/components/Calendar/BigCalendar';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CalendarPage() {
  const { t } = useTranslation('common');
  useSetPageName(t('calendar'));

  return (
    <>
      <PageHeader>{t('calendar')}</PageHeader>
      <Paper sx={{ padding: 1 }}>
        <BigCalendar />
      </Paper>
    </>
  );
}

export const getStaticProps = genGetProps([
  'event',
  'booking',
  'calendar',
]);
