import
{
  Grid,
  Paper,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import BigCalendar from '~/components/Calendar/BigCalendar';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CalendarPage() {
  const { t } = useTranslation('common');
  useSetPageName(t('calendar'));

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <h2>{t('calendar')}</h2>
        <Paper sx={{ padding: 1 }}>
          <BigCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
}

export const getStaticProps = genGetProps([
  'event',
  'booking',
  'calendar',
]);
