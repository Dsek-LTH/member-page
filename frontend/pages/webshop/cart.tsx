import { Button, Stack, Typography } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import CartItems from '~/components/Webshop/Cart/CartItems';
import { useMyCartQuery, useRemoveMyCartMutation } from '~/generated/graphql';
import Link from '~/components/Link';
import routes from '~/routes';
import { useDialog } from '~/providers/DialogProvider';

export default function CartPage() {
  const { data, refetch: refetchCart } = useMyCartQuery();
  const { confirm } = useDialog();
  const [removeMyCart] = useRemoveMyCartMutation();
  return (
    <Stack>
      <h2>Cart</h2>
      {!data?.myCart?.cartItems.length && (
        <>
          Du har inget i kundvagnen, besök vår
          {' '}
          <Link href={routes.webshop} style={{ display: 'contents' }}>webshop</Link>
          {' '}
          för att handla
        </>
      )}

      {data?.myCart?.cartItems.length > 0 && (
        <CartItems />
      )}
      {(!data?.myCart?.cartItems.length && data?.myCart?.expiresAt)
      && <Typography sx={{ margin: '1rem 0' }}>Däremot har du en aktiv kundvagn, den kan du slänga om du vill</Typography>}
      <Stack direction="row">
        {data?.myCart?.expiresAt && (
        <Button
          variant="contained"
          color="error"
          sx={{ width: data?.myCart?.cartItems.length ? '50%' : 'fit-content' }}
          onClick={() => {
            confirm('Är du säker på att du vill slänga kundvagnen?', (ok) => {
              if (ok) {
                removeMyCart().then(() => refetchCart());
              }
            });
          }}
        >
          Släng kundvagn
        </Button>
        )}
        {data?.myCart?.cartItems.length > 0 && (
          <NextLink href={routes.checkout} passHref>
            <Button variant="contained" sx={{ width: '50%' }}>
              <ShoppingCartCheckoutIcon />
              {' '}
              Checka ut
            </Button>
          </NextLink>
        )}
      </Stack>
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['cart', 'common'])),
  },
});
