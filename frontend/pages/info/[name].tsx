import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Markdown from '~/components/Markdown';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function Info() {
  const { query } = useRouter();
  const name = query?.name as string;
  return (
    <NoTitleLayout>
      <Markdown name={name} />
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
