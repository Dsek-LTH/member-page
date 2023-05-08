import { useTranslation } from 'react-i18next';
import NewsPage from '~/components/News/NewsPage';
import TVWrapper from '~/components/TV/TVWrapper';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

function NewsTVPage() {
  const { t } = useTranslation();
  useSetPageName(t('news'));
  return (
    <TVWrapper>
      <NewsPage />
    </TVWrapper>
  );
}

NewsTVPage.tv = true;

export default NewsTVPage;

export const getStaticProps = genGetProps(['news']);
