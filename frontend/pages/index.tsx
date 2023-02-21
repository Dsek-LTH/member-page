import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Link, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Cover from '~/components/Home/Cover';
import Widgets from '~/components/Home/Widgets';
import createPageTitle from '~/functions/createPageTitle';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import AppLandingPage from '~/components/App/LandingPage';

function HomePage() {
  const { t } = useTranslation(['homePage', 'common']);
  const isNativeApp = useIsNativeApp();
  if (isNativeApp) {
    return <AppLandingPage />;
  }
  return (
    <Stack spacing={2}>
      <Head>
        <title>{createPageTitle(t, 'home')}</title>
      </Head>
      <Cover />
      <Typography variant="h4" color="secondary">{t('homePage:about')}</Typography>
      <Typography>
        {t('homePage:intro')}
        <Link
          href="https://www.lth.se/utbildning/datateknik300/"
          color="primary"
          rel="noopener noreferrer"
          target="_blank"
        >
          {' '}
          {t('homePage:D')}
          {' '}
        </Link>
        {t('common:and')}
        <Link
          href="https://www.lth.se/utbildning/informations-och-kommunikationsteknik/"
          color="secondary"
          rel="noopener noreferrer"
          target="_blank"
        >
          {' '}
          {t('homePage:C')}
        </Link>
        {'. '}

        {t('homePage:intro2')}
      </Typography>
      <Widgets />
    </Stack>
  );
}

export default HomePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news', 'event', 'homePage'])),
    },
  };
}
