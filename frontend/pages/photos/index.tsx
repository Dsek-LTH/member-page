import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('photos'));
  return (
    <>
      <PageHeader>{t('photos')}</PageHeader>
      <Browser bucket="photos" prefix="public/events" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
