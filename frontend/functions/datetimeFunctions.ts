import { DateTime } from 'luxon';

const units: Intl.RelativeTimeFormatUnit[] = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
];

// eslint-disable-next-line import/prefer-default-export
export const timeAgo = (dateTime: DateTime) => {
  const relDate = dateTime.toRelative();
  const diff = dateTime.diffNow().shiftTo(...units);
  if (diff.weeks <= -1) {
    return dateTime.toLocaleString(DateTime.DATE_SHORT);
  }
  return relDate;
};
