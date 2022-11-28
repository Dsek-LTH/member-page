import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import NewsPage from '~/components/News/NewsPage';
import createPageTitle from '~/functions/createPageTitle';

export default function News() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{createPageTitle(t, 'news')}</title>
      </Head>
      <NewsPage />
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'news'])),
  },
});
