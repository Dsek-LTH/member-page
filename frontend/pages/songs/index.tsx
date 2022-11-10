import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import SongsList from '~/components/Songs/SongsList';

export default function SongsPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('songs')}</h2>
      <SongsList />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
