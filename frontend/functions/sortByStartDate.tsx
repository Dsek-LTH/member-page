import { DateTime } from 'luxon';

export default function sortByStartDate(a: {start_datetime: string}, b: {start_datetime: string}) {
  return DateTime.fromISO(a.start_datetime) < DateTime.fromISO(b.start_datetime) ? 1 : -1;
}
