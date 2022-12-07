import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Cover from '~/components/Home/Cover';
import Widgets from '~/components/Home/Widgets';
import createPageTitle from '~/functions/createPageTitle';

function HomePage() {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Head>
        <title>{createPageTitle(t, 'home')}</title>
      </Head>
      <Cover />
      <Typography variant="h4" color="secondary">Kort om oss</Typography>
      <Typography>
        D-sektionen inom TLTH är en ideell organisation för
        studenter och alumner vid programmen
        <Typography component="span" color="primary"> Datateknik </Typography>
        och
        <Typography component="span" color="secondary"> InfoCom</Typography>
        {'. '}
        Sektionen har sociala arrangemang, näringslivskontakter, studiebevakning,
        och allt annat som hjälper studenter och alumner.
      </Typography>
      <Widgets />
    </Stack>
  );
}

export default HomePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news', 'event'])),
    },
  };
}
