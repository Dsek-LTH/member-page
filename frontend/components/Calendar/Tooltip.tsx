import React from 'react';
import { DateTime } from 'luxon';
import { Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { CalendarEvent } from '~/types/CalendarEvent';
import routes from '~/routes';

export default function Tooltip({ event }: { event: CalendarEvent }) {
  const { t, i18n } = useTranslation(['common', 'calendar']);
  const english = i18n.language === 'en';
  const fromDate = DateTime.fromJSDate(event.start)
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_SHORT);
  const endDate = DateTime.fromJSDate(event.end)
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_SHORT);
  return (
    <>
      <Typography>{english ? event.titleEn : event.title}</Typography>
      <Typography>
        {t('calendar:from')}
        {': '}
        {fromDate}
      </Typography>
      <Typography>
        {t('calendar:to')}
        {': '}
        {endDate}
      </Typography>
      <Typography>
        {english ? event.descriptionEn : event.description}
      </Typography>
      <Link href={routes.event(event.id)} passHref>
        <MuiLink style={{ fontSize: '1rem' }}>
          {t('read_more')}
        </MuiLink>
      </Link>
    </>
  );
}
