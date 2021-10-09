import { DateTime } from 'luxon';
import { Typography } from '@material-ui/core';
import { CalendarEvent } from '~/types/CalendarEvent';
import { useTranslation } from 'react-i18next';

function Tooltip({ event }: { event: CalendarEvent }) {
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

export default Tooltip;
