import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Song from '~/components/Songs/Song';
import genGetProps from '~/functions/genGetServerSideProps';
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

export const getServerSideProps = genGetProps();
