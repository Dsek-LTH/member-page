import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NewsPage from '~/components/News/NewsPage';

export default function News() {
  return (
    <NewsPage />
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'news'])),
  },
});
