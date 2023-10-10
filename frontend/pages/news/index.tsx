import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NewsPage from '~/components/News/NewsPage';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function News() {
  const { t } = useTranslation();
  useSetPageName(t('news'));
  return (
    <NewsPage />
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    isNativeApp: process.env.SERVE_NATIVE_APP === 'true',
    ...(await serverSideTranslations(locale, ['common', ...(['news'] ?? [])])),
  },
});
