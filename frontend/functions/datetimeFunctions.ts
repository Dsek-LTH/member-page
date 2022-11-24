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
  if (diff.months <= -1 || diff.years <= -1) {
    return dateTime.toLocaleString(DateTime.DATE_SHORT);
  }
  return relDate;

  const unit = units.find((u) => diff.get(u) !== 0) || 'second';

  const relativeFormatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};
