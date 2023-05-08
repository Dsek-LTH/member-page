import { useTranslation } from 'next-i18next';
import MarkdownPage from '~/components/MarkdownPage';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CafePage() {
  const { t } = useTranslation();
  useSetPageName(t('cafe'));
  return (
    <>
      <h2>{t('cafe')}</h2>
      <MarkdownPage name="cafe" />
    </>
  );
}

export const getStaticProps = genGetProps(['news']);
