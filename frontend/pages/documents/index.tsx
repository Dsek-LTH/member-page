import { useTranslation } from 'next-i18next';
import Documents from '~/components/Documents';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('meetingDocuments'));
  return (
    <>
      <h2>{t('meetingDocuments')}</h2>
      <Documents />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
