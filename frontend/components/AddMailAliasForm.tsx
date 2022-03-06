import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateMailAliasMutation } from '~/generated/graphql';

export default function AddMailAliasForm({ refetch, email }:
  { refetch: Function, email?: string }) {
  const { t } = useTranslation();

  const [newEmail, setNewEmail] = useState(email || '');
  const [position_id, setPositionId] = useState('');

  const [createMailAlias] = useCreateMailAliasMutation({
    variables: {
      email: newEmail,
      position_id,
    },
  });

  return (
    <Paper style={{ marginTop: '1rem', padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        {t('mailAlias:add')}
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createMailAlias().then(() => {
            refetch();
          });
        }}
      >
        <Stack style={{ marginTop: '1rem' }} spacing={1}>
          <Stack direction="row" spacing={1}>
            {!email && (
              <TextField
                label="Email"
                style={{ width: '100%' }}
                value={newEmail}
                onChange={(event) => {
                  setNewEmail(event.target.value);
                }}
              />
            )}
            <TextField
              label="Position id"
              style={{ width: '100%' }}
              value={position_id}
              onChange={(event) => {
                setPositionId(event.target.value);
              }}
            />
            <Button
              disabled={!position_id || (!newEmail && !position_id)}
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
