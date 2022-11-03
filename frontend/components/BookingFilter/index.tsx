import React from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import DateTimePicker from '../DateTimePicker';

type BookingFilterProps = {
  to: DateTime
  onToChange: React.Dispatch<React.SetStateAction<DateTime>>
};

export default function BookingFilter({ to, onToChange }: BookingFilterProps) {
  const { t } = useTranslation(['common', 'booking']);

  return (
    <DateTimePicker
      dateTime={to}
      setDateTime={onToChange}
      timeLabel={t('booking:endTime')}
      dateLabel={t('booking:endDate')}
    />
  );
}
