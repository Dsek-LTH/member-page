import { useTranslation } from 'next-i18next';
import PageHeader from '~/components/PageHeader';
import SongsList from '~/components/Songs/SongsList';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function SongsPage() {
  const { t } = useTranslation();
  useSetPageName(t('songs'));
  return (
    <>
      <PageHeader>{t('songs')}</PageHeader>
      <SongsList />
    </>
  );
}

export const getStaticProps = genGetProps();
