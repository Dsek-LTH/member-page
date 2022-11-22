import { useState } from 'react';
import {
  Alert,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { useMyCartQuery, useInitiatePaymentMutation } from '~/generated/graphql';
import routes from '~/routes';

export default function CartPage() {
  const { data } = useMyCartQuery();
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const [initiatePayment, { error, loading }] = useInitiatePaymentMutation(
    { variables: { phoneNumber } },
  );
  return (
    <>
      <h2>Check out</h2>
      <Stack spacing={2}>
        <Typography>
          Nu ska du betala
          {' '}
          {data?.myCart?.totalPrice}
          {' '}
          kr
        </Typography>
        {error && <Alert severity="error">Felaktigt telefonnummer</Alert>}
        <TextField
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          sx={{ width: 300 }}
          placeholder="46729438490"
          label="Telefonnummer"
        />
        <LoadingButton
          sx={{ width: 300 }}
          variant="contained"
          loading={loading}
          onClick={() => {
            initiatePayment().then(({ data: paymentData }) => {
              router.push(routes.awaitPayment(paymentData?.initiatePayment?.id));
            });
          }}
        >
          Starta betalning
        </LoadingButton>
      </Stack>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['checkout', 'common'])),
  },
});
