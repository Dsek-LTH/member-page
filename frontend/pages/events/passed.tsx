import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import PassedEventSet from '~/components/Calendar/PassedEventSet';
import Link from '~/components/Link';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';
import routes from '~/routes';

export default function EventsPage() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'event']);
  useSetPageName(t('passedEvents'));

  return (
    <Stack>
      <h2>{t('passedEvents')}</h2>
      <Stack marginBottom="1rem">
        <Link href={routes.events}>
          <Button>
            {t('upcomingEvents')}
          </Button>
        </Link>
      </Stack>
      <div style={{ marginBottom: '0.5rem' }}>
        <EventSearchInput onSelect={(slug, id) => router.push(routes.event(slug || id))} />
      </div>
      <PassedEventSet />
    </Stack>
  );
}

export const getStaticProps = genGetProps(['event']);
