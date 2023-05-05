import { useTranslation } from 'next-i18next';
import SongsList from '~/components/Songs/SongsList';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function SongsPage() {
  const { t } = useTranslation();
  useSetPageName(t('songs'));
  return (
    <>
      <h2>{t('songs')}</h2>
      <SongsList />
    </>
  );
}

export const getStaticProps = genGetProps();
