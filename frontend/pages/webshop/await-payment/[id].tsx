import
{
  Alert,
  CircularProgress, Stack, Typography,
} from '@mui/material';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import selectTranslation from '~/functions/selectTranslation';
import { useGetPaymentQuery, useMyCartQuery, useMyChestQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

export default function CartPage() {
  useSetPageName(selectTranslation(i18n, 'Betala', 'Pay'));
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch } = useGetPaymentQuery({ variables: { id: id as string } });
  const { user } = useUser();
  const { refetch: refetchCart } = useMyCartQuery();
  const { refetch: refetchChest } = useMyChestQuery({ variables: { studentId: user?.student_id } });

  // refetch payment every other second
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.payment?.paymentStatus === 'PAID') {
      // delay so that the user can see the success message
      setTimeout(() => {
        refetchChest();
        refetchCart();
        router.push(routes.memberChest(user?.student_id));
      }, 500);
    }
  }, [data]);

  if (!id) return null;
  return (
    <>
      <PageHeader>Betala med swish!</PageHeader>
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

export const getServerSideProps = genGetProps(['checkout']);
