import {
  Alert,
  CircularProgress, Stack, Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useGetPaymentQuery, useMyCartQuery } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

export default function CartPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch } = useGetPaymentQuery({ variables: { id: id as string } });
  const { refetch: refetchCart } = useMyCartQuery();
  const { user } = useUser();

  // refetch payment every other second
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.payment?.paymentStatus === 'PAID') {
      refetchCart();
      router.push(routes.memberChest(user.id));
    }
  }, [data]);

  if (!id) return null;
  return (
    <>
      <h2>Betala med swish!</h2>
      <Stack spacing={2}>
        <Typography>
          Öppna swish och följ instruktionerna där.
        </Typography>
        {data?.payment.paymentStatus === 'PENDING' && (
          <Alert severity="info">
            Inväntar betalning...
          </Alert>
        )}
        {data?.payment.paymentStatus === 'PAID' && (
          <Alert severity="success">
            Betalningen är genomförd!
          </Alert>
        )}
        {data?.payment.paymentStatus === 'FAILED' && (
          <Alert severity="error">
            Betalningen misslyckades!
          </Alert>
        )}
        {data?.payment.paymentStatus === 'PENDING' && (
          <div style={{ marginLeft: '3rem' }}>
            <CircularProgress />
          </div>
        )}
      </Stack>
    </>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['checkout', 'common'])),
  },
});
