import { Button } from '@mui/material';
import Link from 'next/link';
import PageHeader from '~/components/PageHeader';
import Webshop from '~/components/Webshop/Webshop';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function WebshopPage() {
  useSetPageName('Webshop');
  const { hasAccess } = useApiAccess();
  return (
    <>
      <PageHeader>Webshop</PageHeader>
      {hasAccess('webshop:create') && (
        <Link href="/webshop/product/create" passHref>
          <Button
            variant="contained"
            style={{
              marginBottom: '1rem',
            }}
          >
            Add product

          </Button>
        </Link>
      )}
      <Webshop />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
