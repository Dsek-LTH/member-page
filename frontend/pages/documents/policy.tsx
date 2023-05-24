import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('policies'));
  return (
    <>
      <PageHeader>{t('policies')}</PageHeader>
      <Browser bucket="files" prefix="public/policy" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
