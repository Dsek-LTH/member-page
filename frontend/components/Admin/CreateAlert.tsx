import { LoadingButton } from '@mui/lab';
import {
  FormControl, InputLabel, TextField, Select, MenuItem, Stack, Typography,
} from '@mui/material';
import { useState } from 'react';
import { AlertColor, useAlertsQuery, useCreateAlertMutation } from '~/generated/graphql';

export default function CreateAlert() {
  const [message, setMessage] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [severity, setSeverity] = useState<AlertColor>(AlertColor.Error);
  const { refetch } = useAlertsQuery();
  const [createAlertMutation, { loading }] = useCreateAlertMutation();
  return (
    <form style={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography>Alerts</Typography>
        <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <TextField label="Message EN" value={messageEn} onChange={(e) => setMessageEn(e.target.value)} />
        <FormControl fullWidth>
          <InputLabel id="severity-label">Severity</InputLabel>
          <Select
            labelId="severity-label"
            id="severity-select"
            value={severity}
            label="Severity"
            onChange={(e) => setSeverity(e.target.value as AlertColor)}
          >
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </Select>
        </FormControl>
        <LoadingButton
          loading={loading}
          disabled={!message || !messageEn}
          variant="contained"
          onClick={() => {
            createAlertMutation({
              variables: {
                message,
                messageEn,
                severity,
              },
            }).then(() => refetch());
          }}
        >
          Create
        </LoadingButton>
      </Stack>
    </form>
  );
}
