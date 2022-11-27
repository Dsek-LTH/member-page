import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button, Stack, TextField } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';

export default function MojtPage() {
  const { keycloak } = useKeycloak<KeycloakInstance>()
  const [message, setMessage] = useState("")
  const [red, setRed] = useState("255");
  const [green, setGreen] = useState("255")
  const [blue, setBlue] = useState("255")

  if (!keycloak.authenticated) {
    return (
      <>
        <h2>mojt</h2>
        <p>Du måste logga in först!</p>
      </>
    )
  }

  return (
    <>
      <h2>mojt</h2>
      <Stack maxWidth={400}>
        <TextField
          id="message"
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            style: { color: `rgb(${red}, ${green}, ${blue})` }
          }} />

        <TextField
          id="red"
          label="Red"
          value={red}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: "red" }
          }}
          onChange={(e) => setRed(e.target.value)} />

        <TextField
          id="green"
          label="Green"
          value={green}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: "green" }
          }}
          onChange={(e) => setGreen(e.target.value)} />

        <TextField
          id="blue"
          label="Blue"
          value={blue}
          type="number"
          InputProps={{
            inputProps: { max: 255, min: 0 },
            style: { color: "blue" }
          }}
          onChange={(e) => setBlue(e.target.value)} />

        <Button variant="contained" disabled={!message || !red || !green || !blue} onClick={() => {
          const data = { message, red, green, blue, authToken: keycloak.idToken }
          fetch("/api/boss", { method: 'POST', body: JSON.stringify(data) })
        }}>Skicka</Button>
      </Stack>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
