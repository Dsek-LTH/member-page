import { DateTime } from 'luxon';
import { Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Router from 'next/router';
import { CalendarEvent } from '~/types/CalendarEvent';
import routes from '~/routes';

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
      <Link href={routes.event(event.id)}>
        <MuiLink href={routes.event(event.id)} style={{ fontSize: '1rem' }}>
          {t('common:read more')}
        </MuiLink>
      </Link>
    </>
  );
}
