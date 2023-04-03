import { useTranslation } from 'next-i18next';
import SongsList from '~/components/Songs/SongsList';
import genGetProps from '~/functions/genGetServerSideProps';

export default function SongsPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('songs')}</h2>
      <SongsList />
    </>
  );
}

export const getStaticProps = genGetProps();
