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
import { useCreateSpecialReceiverMutation } from '~/generated/graphql';
import domains from '~/data/domains';

export default function AddSpecialReceiverForm({ refetch, email }:
{ refetch: Function, email?: string }) {
  const { t } = useTranslation();

  const [newEmail, setNewEmail] = useState(email || '');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [targetEmail, setTargetEmail] = useState('');

  const [createSpecialReceiver] = useCreateSpecialReceiverMutation({
    variables: {
      input: {
        alias: email || (newEmail + selectedDomain),
        targetEmail,
      },
    },
  });

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        Add Special Receiver
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createSpecialReceiver().then(() => {
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
              label="Target Email"
              style={{ width: '100%' }}
              value={targetEmail}
              onChange={(event) => {
                setTargetEmail(event.target.value);
              }}
            />
            <Button
              disabled={(!targetEmail) || (!newEmail && !targetEmail)}
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
