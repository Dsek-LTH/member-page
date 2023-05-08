import Webshop from '~/components/Webshop/Webshop';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function WebshopPage() {
  useSetPageName('Webshop');
  return (
    <>
      <h2>Webshop</h2>
      <Webshop />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
