import {
  Alert,
  CircularProgress, Stack, Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useGetPaymentQuery } from '~/generated/graphql';

export default function CartPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetPaymentQuery({ variables: { id: id as string } });

  if (!id) return null;
  return (
    <>
      <h2>Betala med swish!</h2>
      <Stack spacing={2}>
        <Typography>
          Öppna swish och följ instruktionerna där.
        </Typography>
        <div style={{ marginLeft: '3rem' }}>
          <CircularProgress />
        </div>
        {data?.getPayment.paymentStatus === 'PENDING' && (
          <Alert severity="info">
            Inväntar betalning...
          </Alert>
        )}
        {data?.getPayment.paymentStatus === 'PAID' && (
          <Alert severity="success">
            Betalningen är genomförd!
          </Alert>
        )}
        {data?.getPayment.paymentStatus === 'FAILED' && (
          <Alert severity="error">
            Betalningen misslyckades!
          </Alert>
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
