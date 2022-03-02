import {
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '~/components/DateTimePicker';
import {
  useCreateApiAccessPolicyMutation,
  useCreateDoorAccessPolicyMutation,
  useGetApiQuery,
  useGetDoorQuery,
} from '~/generated/graphql';

export default function AddAccessPolicyForm({
  name,
  isDoor,
}: {
  name?: string;
  isDoor: boolean;
}) {
  const { t } = useTranslation();

  const [newName, setNewName] = useState('');
  const [who, setWho] = useState('');
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState(DateTime.now());
  const [endDateTime, setEndDateTime] = useState(
    DateTime.now().plus({ year: 1 }),
  );

  const { refetch: refetchDoor } = useGetDoorQuery({ variables: { name } });
  const { refetch: refetchApi } = useGetApiQuery({ variables: { name } });

  const [createDoorAccessPolicy] = useCreateDoorAccessPolicyMutation({
    variables: {
      doorName: name || newName,
      who,
      startDatetime: hasExpirationDate ? startDateTime : undefined,
      endDatetime: hasExpirationDate ? endDateTime : undefined,
    },
  });

  const [createApiAccessPolicy] = useCreateApiAccessPolicyMutation({
    variables: {
      apiName: name || newName,
      who,
    },
  });

  return (
    <Paper style={{ marginTop: '1rem', padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        {t('policy:addAccessPolicy')}
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isDoor) {
            createDoorAccessPolicy().then(() => {
              refetchDoor();
              setWho('');
            });
          } else {
            createApiAccessPolicy().then(() => {
              refetchApi();
              setWho('');
            });
          }
        }}
      >
        <Stack style={{ marginTop: '1rem' }} spacing={1}>
          {isDoor && (
            <FormControlLabel
              control={(
                <Switch
                  checked={hasExpirationDate}
                  onChange={(event) => {
                    setHasExpirationDate(event.target.checked);
                  }}
                />
              )}
              label={t('policy:hasExpirationDate') as string}
            />
          )}

          {isDoor && hasExpirationDate && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              style={{ marginTop: '1rem' }}
            >
              <DateTimePicker
                dateTime={startDateTime}
                setDateTime={setStartDateTime}
                timeLabel={t('policy:startTime')}
                dateLabel={t('policy:startDate')}
              />
              <DateTimePicker
                dateTime={endDateTime}
                setDateTime={setEndDateTime}
                timeLabel={t('policy:endTime')}
                dateLabel={t('policy:endDate')}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            {!name && (
              <TextField
                label={t('policy:name') as string}
                style={{ width: '100%' }}
                value={newName}
                onChange={(event) => {
                  setNewName(event.target.value);
                }}
              />
            )}
            <TextField
              label={t('policy:who') as string}
              style={{ width: '100%' }}
              value={who}
              onChange={(event) => {
                setWho(event.target.value);
              }}
            />
            <Button
              disabled={!who || (!name && !newName)}
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
