import Webshop from '~/components/Webshop/Webshop';
import genGetProps from '~/functions/genGetServerSideProps';

export default function SongsPage() {
  return (
    <>
      <h2>Webshop</h2>
      <Webshop />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
