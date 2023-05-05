import AddIcon from '@mui/icons-material/Add';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import EventSet from '~/components/Calendar/UpcomingEventSet';
import Link from '~/components/Link';
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
    <Stack>
      <h2>{t('upcomingEvents')}</h2>
      <Stack marginBottom="1rem" direction="row" flexWrap="wrap" gap={2}>
        <Link href={routes.calendar}>
          <Button>
            {t('calendar')}
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
              <AddIcon style={{ marginLeft: '0.25rem' }} />
            </Button>
          </Link>
        )}
      </Stack>
      <div style={{ marginBottom: '0.5rem' }}>
        <EventSearchInput onSelect={(slug, id) => router.push(routes.event(slug || id))} />
      </div>
      <EventSet />
    </Stack>
  );
}

export const getServerSideProps = genGetProps(['event']);
