import { Divider, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import ManageProduct from '~/components/Webshop/ManageProduct';
import ManageProductInventory from '~/components/Webshop/ManageProductInventory';
import genGetProps from '~/functions/genGetServerSideProps';

export default function ManageProductPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Stack spacing={2}>
      <ManageProduct id={id as string} />
      <Divider />
      <ManageProductInventory id={id as string} />
    </Stack>
  );
}

export const getServerSideProps = genGetProps(['webshop']);
