import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PageHeader from '~/components/PageHeader';
import Song from '~/components/Songs/Song';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSongByTitleQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function SongsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const title = router.query.title as string;

  const { data } = useSongByTitleQuery({ variables: { title } });
  useSetPageName(data?.songByTitle.title ?? t('songs'), t('songs'));
  return (
    <>
      <PageHeader>{t('songs')}</PageHeader>
      {data?.songByTitle && <Song song={data?.songByTitle} />}
    </>
  );
}

export const getServerSideProps = genGetProps();
