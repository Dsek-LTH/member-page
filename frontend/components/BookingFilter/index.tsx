import React from 'react';
import { useTranslation } from 'next-i18next';
import DateTimePicker from '../DateTimePicker';
import { DateTime } from 'luxon';

type BookingFilterProps = {
    from: DateTime
    onFromChange: React.Dispatch<React.SetStateAction<DateTime>>
}

export default function BookingFilter({from, onFromChange}: BookingFilterProps) {
    const { t } = useTranslation(['common', 'booking']);

    return (
        <DateTimePicker
        dateTime={from}
        setDateTime={onFromChange}
        timeLabel={t('booking:startTime')}
        dateLabel={t('booking:startDate')}
    />
    )
}