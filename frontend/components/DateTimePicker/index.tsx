import React from 'react';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useTranslation } from 'next-i18next';
import { DatePicker, TimePicker } from '@mui/lab';
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
