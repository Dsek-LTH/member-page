import AddIcon from '@mui/icons-material/Add';
import
{
  Button,
  Paper, Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import BigCalendar from '~/components/Calendar/BigCalendar';
import Link from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import routes from '~/routes';

export default function CalendarPage() {
  const { t } = useTranslation('common');
  useSetPageName(t('calendar'));
  const { hasAccess } = useApiAccess();

  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <PageHeader noMargin>{t('calendar')}</PageHeader>
      <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={1}>
        <Link href={routes.events}>
          <Button variant="contained">
            {t('events_list')}
          </Button>
        </Link>

        {hasAccess('event:create') && (
          <Link href={routes.createEvent}>
            <Button variant="outlined">
              {t('event:create_event')}
              <AddIcon sx={{ ml: '0.25rem' }} />
            </Button>
          </Link>
        )}
      </Stack>
      <Paper sx={{ padding: 1 }}>
        <BigCalendar />
      </Paper>
    </Stack>
  );
}

export const getStaticProps = genGetProps([
  'event',
  'booking',
  'calendar',
]);
