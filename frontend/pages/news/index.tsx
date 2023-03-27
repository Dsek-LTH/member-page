import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import NewsPage from '~/components/News/NewsPage';
import createPageTitle from '~/functions/createPageTitle';
import genGetProps from '~/functions/genGetServerSideProps';

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

export const getStaticProps = genGetProps(['news']);
