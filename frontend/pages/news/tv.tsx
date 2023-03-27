import NewsPage from '~/components/News/NewsPage';
import TVWrapper from '~/components/TV/TVWrapper';
import genGetProps from '~/functions/genGetServerSideProps';

function NewsTVPage() {
  return (
    <TVWrapper>
      <NewsPage />
    </TVWrapper>
  );
}

NewsTVPage.tv = true;

export default NewsTVPage;

export const getStaticProps = genGetProps(['news']);
