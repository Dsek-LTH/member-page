import { DateTime } from 'luxon';

const fromIsoToShortDate = (text: string, locale: string) => DateTime.fromISO(text)
  .setLocale(locale)
  .toLocaleString(DateTime.DATETIME_SHORT);

export default fromIsoToShortDate;
