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
  const [phoneNumberInvalid, setPhoneNumberInvalid] = useState(false);
  const validatePhoneNumber = (value: string) => {
    // regex for numbers starting with 070, 072, 073, 076, 079 and are exactly 7 characters long
    const regex = /^(070|072|073|076|079)\d{7}$/;
    // remove all spaces and dashes
    const number = value.replace(/[\s-]/g, '');
    const test = regex.test(number);
    setPhoneNumberInvalid(!test);
    return test;
  };
  const router = useRouter();
  const [initiatePayment, { error, loading }] = useInitiatePaymentMutation(
    { variables: { phoneNumber: phoneNumber.replace(/[\s-]/g, '') } },
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
        {(phoneNumberInvalid) && <Alert severity="error">Felaktigt telefonnummer</Alert>}
        {(error) && <Alert severity="error">Vi fick ett fel när vi skulle påbörja din betalning, skrev du rätt telefonnummer?</Alert>}
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (validatePhoneNumber(phoneNumber)) {
            initiatePayment().then(({ data: paymentData }) => {
              router.push(routes.awaitPayment(paymentData?.initiatePayment?.id));
            });
          }
        }}
        >

          <TextField
            type="tel"
            error={phoneNumberInvalid}
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            sx={{ width: 300 }}
            placeholder="070 123 45 67"
            label="Telefonnummer"
          />
        </form>
        <LoadingButton
          sx={{ width: 300 }}
          variant="contained"
          loading={loading}
          onClick={() => {
            if (validatePhoneNumber(phoneNumber)) {
              initiatePayment().then(({ data: paymentData }) => {
                router.push(routes.awaitPayment(paymentData?.initiatePayment?.id));
              });
            }
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
