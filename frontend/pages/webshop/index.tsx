import PageHeader from '~/components/PageHeader';
import Webshop from '~/components/Webshop/Webshop';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function WebshopPage() {
  useSetPageName('Webshop');
  return (
    <>
      <PageHeader>Webshop</PageHeader>
      <Webshop />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
