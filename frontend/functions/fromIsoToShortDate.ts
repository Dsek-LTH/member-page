import { DateTime } from 'luxon';

const fromIsoToShortDate = async (text: string, locale: string) => {
    return DateTime.fromISO(text)
    .setLocale(locale)
    .toLocaleString(DateTime.DATETIME_SHORT)
}

export default fromIsoToShortDate;