import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('kravprofiler'));
  return (
    <>
      <PageHeader>{t('kravprofiler')}</PageHeader>
      <Browser bucket="files" prefix="public/kravprofiler" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
