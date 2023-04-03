import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import genGetProps from '~/functions/genGetServerSideProps';

export default function DocumentPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('policies')}</h2>
      <Browser bucket="files" prefix="public/policy" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
