import { useTranslation } from 'next-i18next';
import Documents from '~/components/Documents';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('meetingDocuments'));
  return (
    <>
      <PageHeader>{t('meetingDocuments')}</PageHeader>
      <Documents />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
