import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Song from '~/components/Songs/Song';
import { useSongByTitleQuery } from '~/generated/graphql';

export default function SongsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const title = router.query.title as string;

  const { data } = useSongByTitleQuery({ variables: { title } });
  return (
    <>
      <h2>{t('songs')}</h2>
      {data?.songByTitle && <Song song={data?.songByTitle} />}
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
