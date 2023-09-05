import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import genGetProps from '~/functions/genGetServerSideProps';
import { useUser } from '~/providers/UserProvider';
import { MAX_MESSAGE_LENGTH } from '../../data/boss';
import { useSetPageName } from '~/providers/PageNameProvider';
import PageHeader from '~/components/PageHeader';
import Message, { MessageType } from '~/components/Mojt/Message';

export default function BossPage() {
  useSetPageName('boss');
  const { data: session } = useSession();
  const { user } = useUser();
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [red, setRed] = useState('255');
  const [green, setGreen] = useState('255');
  const [blue, setBlue] = useState('255');
  const [messages, setMessages] = useState<MessageType[]>([]);

  async function sendMessage() {
    const data = {
      message,
      red,
      green,
      blue,
      authToken: session.accessToken,
    };
    setStatus('');
    setError(false);
    setLoading(true);
    setMessage('');
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages.push({
        content: `${message} //${user.first_name}`,
        sentByYou: true,
        color: `rgb(${red}, ${green}, ${blue})`,
        sentToBoss: false,
      });
      return newMessages;
    });
    const response = await fetch('/api/boss', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const { sent, answer, status: newStatus } = await response.json();
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.push({
          content: answer,
          sentByYou: false,
          color: `rgb(${red}, ${green}, ${blue})`,
          sentToBoss: sent,
        });
        return newMessages;
      });
      if (sent) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].sentToBoss = true;
          return newMessages;
        });
      } else {
        setError(true);
      }
      setStatus(newStatus);
    }
    setLoading(false);
  }

  if (!user?.first_name) {
    return (
      <>
        <PageHeader>boss</PageHeader>
        <p>Du måste logga in först!</p>
      </>
    );
  }

  return (
    <>
      <PageHeader>boss</PageHeader>
      <Stack
        maxWidth={500}
        spacing={1}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        }}
      >
        <Typography>
          Upprepade olämpliga meddelanden kan leda till avstängining. Ditt
          förnamn kommer att skrivas ut efter ditt meddelande.
        </Typography>
        <Stack direction="row" spacing={1}>
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
        </Stack>
        <Paper>
          <Stack padding={2} minHeight={600} spacing={2}>
            <Stack spacing={2} paddingBottom={3}>
              {messages.map((msg) => (
                <Message message={msg} key={msg.content} />
              ))}
              {loading && (
                <CircularProgress
                  sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              )}
            </Stack>
            <TextField
              style={{
                marginTop: 'auto',
              }}
              id="message"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              inputProps={{
                maxLength: MAX_MESSAGE_LENGTH,
              }}
            />
          </Stack>
        </Paper>

        <Button
          variant="contained"
          disabled={!message || !red || !green || !blue}
          onClick={() => {
            sendMessage();
          }}
        >
          Skicka
        </Button>
        <Typography>Message preview:</Typography>
        <Typography
          sx={{
            color: `rgb(${red}, ${green}, ${blue})`,
            backgroundColor: 'black',
            padding: '0.5rem',
          }}
        >
          {`${message} //${user.first_name}`}
        </Typography>
        <Alert
          severity={error ? 'error' : 'success'}
          sx={{ display: status ? 'flex' : 'none' }}
        >
          {status}
        </Alert>
      </Stack>
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
