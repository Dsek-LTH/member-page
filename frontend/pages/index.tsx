import { Link, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import AppLandingPage from '~/components/App/LandingPage';
import Cover from '~/components/Home/Cover';
import Widgets from '~/components/Home/Widgets';
import createPageTitle from '~/functions/createPageTitle';
import genGetProps from '~/functions/genGetServerSideProps';
import { useIsNativeApp } from '~/providers/NativeAppProvider';

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

export const getStaticProps = genGetProps(['calendar', 'news', 'event', 'homePage']);
