import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import EventSet from '~/components/Calendar/UpcomingEventSet';
import Link from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import routes from '~/routes';

export default function EventsPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  useSetPageName(t('upcomingEvents'));
  const { hasAccess } = useApiAccess();
  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <PageHeader noMargin>{t('upcomingEvents')}</PageHeader>
      <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={1}>
        <Link href={routes.calendar}>
          <Button variant="contained">
            {t('calendar')}
            <CalendarMonthIcon sx={{ ml: '0.25rem', mt: -0.5 }} />
          </Button>
        </Link>
        <Link href={routes.passedEvents}>
          <Button>
            {t('passedEvents')}
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
      <EventSearchInput onSelect={(slug, id) => router.push(routes.event(slug || id))} />
      <EventSet />
    </Stack>
  );
}

export const getServerSideProps = genGetProps(['event']);
