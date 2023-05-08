import { Link, Stack, Typography } from '@mui/material';
import { i18n, useTranslation } from 'next-i18next';
import AppLandingPage from '~/components/App/LandingPage';
import Cover from '~/components/Home/Cover';
import Widgets from '~/components/Home/Widgets';
import genGetProps from '~/functions/genGetServerSideProps';
import selectTranslation from '~/functions/selectTranslation';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import { useSetPageName } from '~/providers/PageNameProvider';

function HomePage() {
  const { t } = useTranslation(['homePage', 'common']);
  useSetPageName('', selectTranslation(i18n, 'iDét', 'iDét'));

  const isNativeApp = useIsNativeApp();
  if (isNativeApp) {
    return <AppLandingPage />;
  }
  return (
    <Stack spacing={2}>
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
