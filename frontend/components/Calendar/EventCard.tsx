import React from 'react';
import {
  Paper, Stack, Box, Typography, Chip,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import AdjustIcon from '@mui/icons-material/Adjust';
import { styled } from '@mui/system';
import articleStyles from '~/components/News/articleStyles';
import Link from '~/components/Link';
import routes from '~/routes';
import { EventsQuery } from '~/generated/graphql';
import BigCalendarDay from './BigCalendarDay';
import selectTranslation from '~/functions/selectTranslation';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import startAndEndDateToStringRows from '~/functions/startAndEndDateToStringRows';

const CalendarDayContainer = styled(Box)`
  @media (min-width: 768px) {
    display: block;
  }
  display: none;
`;

const eventOngoing = (startDate: DateTime, endDate: DateTime): boolean => {
  const now = DateTime.now().toMillis();
  const start = startDate.toMillis();
  const end = endDate.toMillis();
  return start < now && end > now;
};

export default function EventCard({
  event,
}: {
  event: EventsQuery['events']['events'][number];
}) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const stringRows = startAndEndDateToStringRows(startDate, endDate);

  return (
    <Paper className={classes.article} component="article">
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
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Stack spacing={0.5}>
                    <Typography
                      color="primary"
                      variant="h5"
                      style={{ fontSize: '1.5rem' }}
                    >
                      {stringRows.row1}
                    </Typography>
                    <Typography
                      color="primary"
                      variant="h5"
                      style={{ fontSize: '1rem' }}
                    >
                      {stringRows.row2}
                    </Typography>
                  </Stack>
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
                <Typography
                  variant="h4"
                  color="text.primary"
                  component="h1"
                  style={{ whiteSpace: 'normal' }}
                >
                  {selectTranslation(i18n, event?.title, event?.title_en)}
                </Typography>
              </Stack>
              <CalendarDayContainer>
                <BigCalendarDay day={startDate.day} />
              </CalendarDayContainer>
            </Stack>
          </Link>
          <Typography>
            {selectTranslation(
              i18n,
              event?.short_description,
              event?.short_description_en,
            )}
          </Typography>
        </Grid>

        <Stack
          width="100%"
          marginTop="1rem"
          justifyContent="start"
        >
          {event.location && (
            <Typography variant="body2">
              {`${t('event:location')}: ${event.location}`}
            </Typography>
          )}
          <Typography variant="body2">
            {`${t('event:organizer')}: ${event.organizer}`}
          </Typography>
          {hasAccess(apiContext, 'event:update') && (
            <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
          )}
        </Stack>
      </Grid>
    </Paper>
  );
}
