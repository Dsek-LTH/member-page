import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import DateTimePicker from '~/components/DateTimePicker';
import {
  useCreateApiAccessPolicyMutation,
  useCreateDoorAccessPolicyMutation,
} from '~/generated/graphql';
import PositionsSelector from './Members/PositionsSelector';
import SearchInput from './Header/SearchInput';

export default function AddAccessPolicyForm({
  name,
  refetch,
  isDoor,
}: {
  name?: string;
  refetch: () => void;
  isDoor: boolean;
}) {
  const { t } = useTranslation();
  const [typeOfWho, setTypeOfWho] = useState('role');
  const [newName, setNewName] = useState('');
  const [who, setWho] = useState('');
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState(DateTime.now());
  const [endDateTime, setEndDateTime] = useState(
    DateTime.now().plus({ year: 1 }),
  );
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
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h5" component="h2">
        {t('policy:addAccessPolicy')}
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isDoor) {
            createDoorAccessPolicy().then(() => {
              refetch();
              setWho('');
            });
          } else {
            createApiAccessPolicy().then(() => {
              refetch();
              setWho('');
            });
          }
        }}
      >
        <Stack style={{ marginTop: '1rem' }} spacing={1}>
          <FormControl>
            <FormLabel id="radio-buttons-label">Typ av &quot;vem&quot;</FormLabel>
            <RadioGroup
              row
              aria-labelledby="radio-buttons-label"
              name="row-radio-buttons-group"
              value={typeOfWho}
              onChange={(event) => setTypeOfWho(event.target.value)}
            >
              <FormControlLabel value="role" control={<Radio />} label="Roll" />
              <FormControlLabel value="person" control={<Radio />} label="Person" />
              <FormControlLabel value="string" control={<Radio />} label="String" />
            </RadioGroup>
          </FormControl>
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
                value={startDateTime}
                onChange={setStartDateTime}
                label={t('policy:startTime')}
              />
              <DateTimePicker
                value={endDateTime}
                onChange={setEndDateTime}
                label={t('policy:endTime')}
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
            {typeOfWho === 'role' && (
              <PositionsSelector setSelectedPosition={(p) => setWho(p.id)} />
            )}
            {typeOfWho === 'person' && (
              <SearchInput onSelect={(studentId) => setWho(studentId)} />
            )}
            {typeOfWho === 'string' && (
              <TextField
                label={t('policy:who') as string}
                style={{ width: '100%' }}
                value={who}
                onChange={(event) => {
                  setWho(event.target.value);
                }}
              />
            )}
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
