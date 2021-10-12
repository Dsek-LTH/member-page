import React, { useContext } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import { articleStyles } from '~/components/News/articlestyles';
import { DateTime } from 'luxon';
import Link from 'next/link';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import { EventsQuery } from '~/generated/graphql';
import BigCalendarDay from './BigCalendarDay';
import AdjustIcon from '@mui/icons-material/Adjust';

const eventOngoing = (startDate: DateTime, endDate: DateTime): boolean => {
  const now = DateTime.now().toMillis();
  const start = startDate.toMillis();
  const end = endDate.toMillis();
  return start < now && end > now;
};

export default function SmallEventCard({
  event,
}: {
  event: EventsQuery['events'][number];
}) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const english = i18n.language === 'en';
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  return (
    <Paper className={classes.article} component={'article'}>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
        style={{ position: 'relative' }}
      >
        <Grid
          className={classes.bodyGrid}
          item
          xs={12}
          md={12}
          lg={12}
          style={{ minHeight: '140px' }}
        >
          <Link href={routes.event(event.id)}>
            <MuiLink href={routes.event(event.id)}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography color="primary" variant="h5">
                      {startDate.toLocaleString(DateTime.DATETIME_MED)} -{' '}
                      {endDate.toLocaleString(DateTime.DATETIME_MED)}
                    </Typography>
                    {eventOngoing(startDate, endDate) && (
                      <Chip
                        style={{ cursor: 'inherit' }}
                        icon={<AdjustIcon />}
                        label={t('event:event_ongoing')}
                        variant="outlined"
                        color="error"
                      />
                    )}
                  </Stack>

                  <h3 className={classes.header}>
                    {english && event.title_en ? event.title_en : event.title}
                  </h3>
                </Box>
                <BigCalendarDay day={startDate.day} />
              </Stack>
            </MuiLink>
          </Link>

          <Typography>
            {english && event.short_description_en
              ? event.short_description_en
              : event.short_description}
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.footer}>
          <br />
          {event.location && (
            <span>
              {t('event:location')}: {event.location}
            </span>
          )}
          <br />
          <span>
            {t('event:organizer')}: {event.organizer}
          </span>
          <br />
          <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
        </Grid>
      </Grid>
    </Paper>
  );
}
