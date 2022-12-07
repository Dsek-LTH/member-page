import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import EventSet from '~/components/Calendar/UpcomingEventSet';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import routes from '~/routes';
import Link from '~/components/Link';

export default function EventsPage() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <Stack>
      <h2>{t('upcomingEvents')}</h2>
      <Stack marginBottom="1rem" direction="row" spacing={2}>
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
      </Stack>
      <div style={{ marginBottom: '0.5rem' }}>
        <EventSearchInput onSelect={(slug, id) => router.push(routes.event(slug || id))} />
      </div>
      <EventSet />
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
