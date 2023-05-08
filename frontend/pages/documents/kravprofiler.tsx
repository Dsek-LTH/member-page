import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('kravprofiler'));
  return (
    <>
      <h2>{t('kravprofiler')}</h2>
      <Browser bucket="files" prefix="public/kravprofiler" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
