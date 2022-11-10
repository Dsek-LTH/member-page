import React from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'next-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Stack, TextField } from '@mui/material';
import { DateTime } from 'luxon';

type DateTimePickerProps = {
  dateTime: DateTime;
  timeLabel?: string;
  dateLabel?: string;
  setDateTime: (string) => void;
};

export default function DateTimePicker({
  dateTime,
  setDateTime,
  timeLabel,
  dateLabel,
}: DateTimePickerProps) {
  const { i18n } = useTranslation(['common']);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale={i18n.language}>
      <Stack spacing={2} direction="row">
        <DatePicker
          label={dateLabel}
          value={dateTime}
          onChange={(newDate) => {
            setDateTime(newDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <TimePicker
          label={timeLabel}
          value={dateTime}
          onChange={(newTime) => {
            setDateTime(newTime);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
