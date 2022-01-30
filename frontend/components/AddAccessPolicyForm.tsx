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
import { useCreateAccessPolicyMutation, useGetDoorQuery } from '~/generated/graphql';

export default function AddAccessPolicyForm({
  doorName,
}: {
  doorName: string;
}) {
  const { t } = useTranslation();

  const [who, setWho] = useState('');
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState(DateTime.now());
  const [endDateTime, setEndDateTime] = useState(
    DateTime.now().plus({ year: 1 }),
  );

  const { refetch: refetchDoor } = useGetDoorQuery({ variables: { name: doorName } });
  const [createAccessPolicy] = useCreateAccessPolicyMutation({
    variables: {
      doorName,
      who,
      startDatetime: hasExpirationDate ? startDateTime : undefined,
      endDatetime: hasExpirationDate ? endDateTime : undefined,
    },
  });

  return (
    <Paper style={{ marginTop: '1rem', padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        {t('doors:addAccessPolicy')}
      </Typography>
      <form onSubmit={(event) => {
        event.preventDefault();
        createAccessPolicy().then(() => {
          refetchDoor();
          setWho('');
        });
      }}
      >
        <Stack style={{ marginTop: '1rem' }} spacing={1}>
          <FormControlLabel
            control={(
              <Switch
                checked={hasExpirationDate}
                onChange={(event) => {
                  setHasExpirationDate(event.target.checked);
                }}
              />
          )}
            label={t('doors:hasExpirationDate') as string}
          />
          {hasExpirationDate && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              style={{ marginTop: '1rem' }}
            >
              <DateTimePicker
                dateTime={startDateTime}
                setDateTime={setStartDateTime}
                timeLabel={t('doors:startTime')}
                dateLabel={t('doors:startDate')}
              />
              <DateTimePicker
                dateTime={endDateTime}
                setDateTime={setEndDateTime}
                timeLabel={t('doors:endTime')}
                dateLabel={t('doors:endDate')}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            <TextField
              label={t('doors:who') as string}
              style={{ width: '100%' }}
              value={who}
              onChange={(event) => {
                setWho(event.target.value);
              }}
            />
            <Button
              disabled={!who}
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
