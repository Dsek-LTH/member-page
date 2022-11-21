import { useState } from 'react';
import {
  Button, Stack, TextField, Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMyCartQuery, useInitiatePaymentMutation } from '~/generated/graphql';
import routes from '~/routes';

export default function CartPage() {
  const { data } = useMyCartQuery();
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const [initiatePayment] = useInitiatePaymentMutation(
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
        <TextField
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          sx={{ width: 300 }}
          placeholder="46729438490"
          label="Telefonnummer"
        />
        <Button
          sx={{ width: 300 }}
          variant="contained"
          onClick={() => {
            initiatePayment().then(({ data: paymentData }) => {
              router.push(routes.awaitPayment(paymentData?.initiatePayment?.id));
            });
          }}
        >
          Starta betalning
        </Button>
      </Stack>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['checkout', 'common'])),
  },
});
