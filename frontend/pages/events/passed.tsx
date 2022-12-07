import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import PassedEventSet from '~/components/Calendar/PassedEventSet';
import EventSearchInput from '~/components/Calendar/EventSearchInput';
import routes from '~/routes';
import Link from '~/components/Link';

export default function EventsPage() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'event']);

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

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'event'])),
  },
});
