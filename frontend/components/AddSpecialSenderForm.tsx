import {
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCreateSpecialSenderMutation } from '~/generated/graphql';
import domains from '~/data/domains';

export default function AddSpecialSenderForm({ refetch, email }:
{ refetch: Function, email?: string }) {
  const { t } = useTranslation();

  const [newEmail, setNewEmail] = useState(email || '');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [username, setUsername] = useState('');
  const [keycloakId, setKeycloakId] = useState('');

  const [createSpecialSender] = useCreateSpecialSenderMutation({
    variables: {
      input: {
        alias: email || (newEmail + selectedDomain),
        studentId: username,
        keycloakId,

      },
    },
  });

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        Add Special Sender
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createSpecialSender().then(() => {
            refetch();
          });
        }}
      >
        <Stack style={{ marginTop: '1rem' }} spacing={1}>
          <Stack direction="row" spacing={1}>
            {!email && (
              <>
                <TextField
                  label="Email"
                  style={{ width: '100%' }}
                  value={newEmail}
                  onChange={(event) => {
                    setNewEmail(event.target.value);
                  }}
                />
                <Select
                  value={selectedDomain}
                  onChange={(newValue) => setSelectedDomain(newValue.target.value)}
                >
                  {domains.map((domain) => (
                    <MenuItem key={`domain${domain}`} value={domain}>{domain}</MenuItem>
                  ))}
                </Select>
              </>
            )}
            <TextField
              label="Username"
              style={{ width: '100%' }}
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              label="Keycloak ID"
              style={{ width: '100%' }}
              value={keycloakId}
              onChange={(event) => {
                setKeycloakId(event.target.value);
              }}
            />
            <Button
              disabled={(!username && !keycloakId) || (!newEmail && !username && !keycloakId)}
              variant="outlined"
              type="submit"
              style={{ minWidth: 'fit-content' }}
            >
              {t('add')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
