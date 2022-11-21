import { Button, Stack } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CartItems from '~/components/Webshop/Cart/CartItems';

export default function CartPage() {
  return (
    <Stack>
      <h2>Cart</h2>
      <CartItems />
      <Button variant="contained">
        <ShoppingCartCheckoutIcon />
        {' '}
        Checka ut
      </Button>
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['cart', 'common'])),
  },
});
