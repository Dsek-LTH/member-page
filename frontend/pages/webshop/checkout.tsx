import { LoadingButton } from '@mui/lab';
import
{
  Alert,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import selectTranslation from '~/functions/selectTranslation';
import { useInitiatePaymentMutation, useMyCartQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';
import routes from '~/routes';

export default function CartPage() {
  useSetPageName(selectTranslation(i18n, 'Betala', 'Check out'));
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
      <PageHeader>Check out</PageHeader>
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
              router.push(routes.awaitPayment(paymentData?.webshop?.initiatePayment?.id));
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
                router.push(routes.awaitPayment(paymentData?.webshop?.initiatePayment?.id));
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

export const getStaticProps = genGetProps(['checkout']);
