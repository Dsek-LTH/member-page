import { DateTime } from 'luxon';

export function sortByStartDateDescending(
  a: { start_datetime: string },
  b: { start_datetime: string },
) {
  return DateTime.fromISO(a.start_datetime) < DateTime.fromISO(b.start_datetime) ? 1 : -1;
}

export function sortByStartDateAscending(
  a: { start_datetime: string },
  b: { start_datetime: string },
) {
  return DateTime.fromISO(a.start_datetime) > DateTime.fromISO(b.start_datetime) ? 1 : -1;
}
