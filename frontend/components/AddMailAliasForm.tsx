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
import { useTranslation } from 'react-i18next';
import { useCreateMailAliasMutation, AllPositionsQuery } from '~/generated/graphql';
import PositionsSelector from './Members/PositionsSelector';

const domains = ['@dsek.se', '@nolla.nu', '@yrka.nu', '@teknikfokus.se', '@juble.se', '@geekend.se'];

export default function AddMailAliasForm({ refetch, email }:
{ refetch: Function, email?: string }) {
  const { t } = useTranslation();

  const [newEmail, setNewEmail] = useState(email || '');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [position, setSelectedPosition] = useState<AllPositionsQuery['positions']['positions'][number] | undefined>();

  const [createMailAlias] = useCreateMailAliasMutation({
    variables: {
      email: email || (newEmail + selectedDomain),
      position_id: position?.id,
    },
  });

  return (
    <Paper style={{ padding: '1rem' }}>
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
            <PositionsSelector setSelectedPosition={setSelectedPosition} />
            <Button
              disabled={!position || (!newEmail && !position)}
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
