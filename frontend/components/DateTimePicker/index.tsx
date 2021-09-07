import React from 'react';
import AdapterLuxon from '@material-ui/lab/AdapterLuxon';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { useTranslation } from 'next-i18next';
import { DatePicker, TimePicker } from '@material-ui/lab';
import { Stack, TextField } from '@material-ui/core';
import { DateTime } from 'luxon';

type DateTimePickerProps = {
    dateTime: DateTime,
    timeLabel?: string,
    dateLabel?: string,
    setDateTime: (string) => void,
}

export default function DateTimePicker({ dateTime, setDateTime, timeLabel, dateLabel }: DateTimePickerProps) {
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
    )
}