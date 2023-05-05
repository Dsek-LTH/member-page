import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('photos'));
  return (
    <>
      <h2>{t('photos')}</h2>
      <Browser bucket="photos" prefix="public/events" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
