import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Webshop from '~/components/Webshop/Webshop';

export default function SongsPage() {
  return (
    <>
      <h2>Webshop</h2>
      <Webshop />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'webshop'])),
    },
  };
}
