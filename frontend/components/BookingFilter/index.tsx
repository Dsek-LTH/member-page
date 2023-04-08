import React from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import DateTimePicker from '../DateTimePicker';

type BookingFilterProps = {
  isStart?: boolean
  value: DateTime
  onChange: React.Dispatch<React.SetStateAction<DateTime>>
};

export default function BookingFilter({ isStart, value, onChange }: BookingFilterProps) {
  const { t } = useTranslation(['common', 'booking']);

  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      label={isStart ? t('booking:startTime') : t('booking:endTime')}
    />
  );
}
