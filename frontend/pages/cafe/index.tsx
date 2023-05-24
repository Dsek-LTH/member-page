import { useTranslation } from 'next-i18next';
import MarkdownPage from '~/components/MarkdownPage';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CafePage() {
  const { t } = useTranslation();
  useSetPageName(t('cafe'));
  return (
    <>
      <PageHeader>{t('cafe')}</PageHeader>
      <MarkdownPage name="cafe" />
    </>
  );
}

export const getStaticProps = genGetProps(['news']);
