import { Button, Stack } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CartItems from '~/components/Webshop/Cart/CartItems';
import { useMyCartQuery } from '~/generated/graphql';
import Link from '~/components/Link';
import routes from '~/routes';

export default function CartPage() {
  const { data } = useMyCartQuery();
  return (
    <Stack>
      <h2>Cart</h2>
      {!data?.myCart?.cartItems.length && (
        <>
          Du har inget i kundvagnen, besök vår
          {' '}
          <Link href={routes.webshop} style={{ display: 'inline' }}>webshop</Link>
          {' '}
          för att handla
        </>
      )}
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
