import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import PingCard from '~/components/Ping/PingCard';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetPingsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Pings() {
  const apiContext = useApiAccess();
  const { t } = useTranslation(['common', 'member']);
  useSetPageName(t('member:pings'));
  const { data } = useGetPingsQuery();
  if (!hasAccess(apiContext, 'core:member:ping')) { return <h2>{t('no_permission_page')}</h2>; }

  const pings = data?.pings;
  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <h2 style={{ marginBlockEnd: 0 }}>{t('member:pings')}</h2>
      {pings?.map((ping) => (
        <PingCard ping={ping} key={ping.from.id} />
      ))}
    </Stack>
  );
}

export const getStaticProps = genGetProps(['common', 'member']);
