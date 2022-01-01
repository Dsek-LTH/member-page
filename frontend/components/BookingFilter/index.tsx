import React from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import DateTimePicker from '../DateTimePicker';

type BookingFilterProps = {
    from: DateTime
    onFromChange: React.Dispatch<React.SetStateAction<DateTime>>
}

export default function BookingFilter({ from, onFromChange }: BookingFilterProps) {
  const { t } = useTranslation(['common', 'booking']);

  return (
    <DateTimePicker
      dateTime={from}
      setDateTime={onFromChange}
      timeLabel={t('booking:startTime')}
      dateLabel={t('booking:startDate')}
    />
  );
}
