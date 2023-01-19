import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { TextField } from '@mui/material';

type DateTimePickerProps = Omit<React.ComponentProps<typeof MuiDateTimePicker>, 'renderInput'>;

export default function DateTimePicker(props: DateTimePickerProps) {
  const { i18n } = useTranslation(['common']);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale={i18n.language}>
      <MuiDateTimePicker
        renderInput={(p) => <TextField fullWidth {...p} />}
        {...props}
        InputProps={{
          fullWidth: true,
          error: false,
        }}
      />
    </LocalizationProvider>
  );
}
