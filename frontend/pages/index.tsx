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
      <Typography variant="h4" color="primary">Kort om oss</Typography>
      <Typography fontSize={20}>
        D-sektionen inom TLTH är en ideell organisation för
        studenter och alumner vid programmen Datateknik och InfoCom.
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
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
    },
  };
}
