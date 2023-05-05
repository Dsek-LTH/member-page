import { useTranslation } from 'next-i18next';
import NewsPage from '~/components/News/NewsPage';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function News() {
  const { t } = useTranslation();
  useSetPageName(t('news'));
  return (
    <NewsPage />
  );
}

export const getStaticProps = genGetProps(['news']);
