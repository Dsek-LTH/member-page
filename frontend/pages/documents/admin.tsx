import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import Link from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('meetingDocuments'));
  return (
    <>
      <PageHeader>{t('meetingDocuments')}</PageHeader>
      <div style={{ margin: '1rem 0' }}>
        <Link href="/documents">Tillbaka till dokument</Link>
      </div>
      <Browser bucket="documents" prefix="public" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
