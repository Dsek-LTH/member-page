import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NewsPage from '~/components/News/NewsPage';
import TVWrapper from '~/components/TV/TVWrapper';

function NewsTVPage() {
  return (
    <TVWrapper>
      <NewsPage />
    </TVWrapper>
  );
}

NewsTVPage.tv = true;

export default NewsTVPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'news'])),
  },
});
