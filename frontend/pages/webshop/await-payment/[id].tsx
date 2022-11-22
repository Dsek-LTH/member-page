import {
  Alert,
  CircularProgress, Stack, Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useGetPaymentQuery } from '~/generated/graphql';

export default function CartPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch } = useGetPaymentQuery({ variables: { id: id as string } });
  // refetch payment every second
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
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
