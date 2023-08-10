import CreateProduct from '~/components/Webshop/CreateProduct';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function WebshopPage() {
  useSetPageName('Create Product');
  return (
    <>
      <CreateProduct />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
