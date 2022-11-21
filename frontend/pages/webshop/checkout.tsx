import { useState } from 'react';
import {
  Button, Stack, TextField, Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMyCartQuery, useInitiatePaymentMutation } from '~/generated/graphql';

export default function CartPage() {
  const { data } = useMyCartQuery();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initiatePayment] = useInitiatePaymentMutation(
    { variables: { phoneNumber } },
  );
  return (
    <>
      <h2>Check out</h2>
      <Stack spacing={2}>
        <Typography>
          Nu måste du betala
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
        />
        <Button
          sx={{ width: 300 }}
          variant="contained"
          onClick={() => {
            initiatePayment();
          }}
        >
          Betala

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
