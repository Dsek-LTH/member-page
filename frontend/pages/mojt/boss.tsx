import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import {
  Alert, Button, Stack, TextField, Typography,
} from '@mui/material';
import { MAX_MESSAGE_LENGTH } from '../../data/boss';
import { useUser } from '~/providers/UserProvider';

export default function BossPage() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [red, setRed] = useState('255');
  const [green, setGreen] = useState('255');
  const [blue, setBlue] = useState('255');
  if (!user?.first_name) {
    return (
      <>
        <h2>boss</h2>
        <p>Du måste logga in först!</p>
      </>
    );
  }

  return (
    <>
      <h2>boss</h2>
      <Stack maxWidth={500} spacing={1}>
        <Typography>
          Upprepade olämpliga meddelanden kan leda till avstängining.
          Ditt förnamn kommer att skrivas ut efter ditt meddelande.
        </Typography>
        <TextField
          id="message"
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          inputProps={{
            maxLength: MAX_MESSAGE_LENGTH,
          }}
        />

        <TextField
          id="red"
          label="Red"
          value={red}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: 'red' },
          }}
          onChange={(e) => setRed(e.target.value)}
        />

        <TextField
          id="green"
          label="Green"
          value={green}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: 'green' },
          }}
          onChange={(e) => setGreen(e.target.value)}
        />

        <TextField
          id="blue"
          label="Blue"
          value={blue}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: 'blue' },
          }}
          onChange={(e) => setBlue(e.target.value)}
        />
        <Typography>Message preview:</Typography>
        <Typography sx={{ color: `rgb(${red}, ${green}, ${blue})`, backgroundColor: 'black', padding: '0.5rem' }}>
          {`${message} //${user.first_name}`}
        </Typography>
        <Button
          variant="contained"
          disabled={!message || !red || !green || !blue}
          onClick={() => {
            const data = {
              message, red, green, blue, authToken: session.idToken,
            };
            setStatus('');
            setError(false);
            fetch('/api/boss', { method: 'POST', body: JSON.stringify(data) })
              .then((res) => res.json())
              .then((resData) => {
                if (resData.success) {
                  setStatus(`Sent message: ${resData.message}`);
                } else {
                  setStatus(`Error: ${resData.message}`);
                  setError(true);
                }
              });
          }}
        >
          Skicka
        </Button>
        <Alert severity={error ? 'error' : 'success'} sx={{ display: status ? 'flex' : 'none' }}>
          {status}
        </Alert>
      </Stack>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
