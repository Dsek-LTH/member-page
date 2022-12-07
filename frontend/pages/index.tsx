import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Link, Stack, Typography } from '@mui/material';
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
        <Link
          href="https://www.lth.se/utbildning/datateknik300/"
          color="primary"
          rel="noopener noreferrer"
          target="_blank"
        >
          {' '}
          Datateknik
          {' '}
        </Link>
        och
        <Link
          href="https://www.lth.se/utbildning/informations-och-kommunikationsteknik/"
          color="secondary"
          rel="noopener noreferrer"
          target="_blank"
        >
          {' '}
          InfoCom

        </Link>
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
