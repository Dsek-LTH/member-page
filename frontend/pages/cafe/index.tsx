import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useGetMarkdownQuery } from '~/generated/graphql';

export default function CafePage() {
  const { data } = useGetMarkdownQuery({ variables: { name: 'cafe' } });
  return (
    <>
      <h2>Hej hopp</h2>
      <p>{data?.markdown?.markdown}</p>
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
