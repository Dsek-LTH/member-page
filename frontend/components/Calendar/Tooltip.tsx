import { DateTime } from 'luxon';
import { Typography } from '@mui/material';
import { CalendarEvent } from '~/types/CalendarEvent';
import { useTranslation } from 'react-i18next';

export default function Tooltip({ event }: { event: CalendarEvent }) {
  const { t, i18n } = useTranslation('calendar');
  const fromDate = DateTime.fromJSDate(event.start)
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_SHORT);
  const endDate = DateTime.fromJSDate(event.end)
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_SHORT);
  return (
    <>
      <Typography>{event.title}</Typography>
      <Typography>
        {t('from')}: {fromDate}
      </Typography>
      <Typography>
        {t('to')}: {endDate}
      </Typography>
      <Typography>{event.description}</Typography>
    </>
  );
}
