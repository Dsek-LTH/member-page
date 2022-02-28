import React from 'react';
import {
  Paper, Button, Typography, Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { DateTime } from 'luxon';
import LinkIcon from '@mui/icons-material/Link';
import articleStyles from '~/components/News/articleStyles';
import Link from '~/components/Link';
import routes from '~/routes';
import { EventQuery } from '~/generated/graphql';
import BigCalendarDay from './BigCalendarDay';
import selectTranslation from '~/functions/selectTranslation';
import startAndEndDateToStringRows from '~/functions/startAndEndDateToStringRows';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function EventPage({ event }: { event: EventQuery['event'] }) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const apiContext = useApiAccess();
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const stringRows = startAndEndDateToStringRows(startDate, endDate);
  const markdown = selectTranslation(i18n, event?.description, event?.description_en) || '';
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
          <Stack direction="column" spacing={1}>
            <BigCalendarDay day={startDate.day} />
            <Typography
              variant="h4"
              color="text.primary"
              component="h1"
              style={{ whiteSpace: 'normal' }}
            >
              {selectTranslation(i18n, event?.title, event?.title_en)}
            </Typography>
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
            {event.link && (
              <Link href={event.link} newTab>
                <Button variant="outlined" startIcon={<LinkIcon />}>
                  {t('event:link_to_event')}
                </Button>
              </Link>
            )}
          </Stack>
          <ReactMarkdown>
            {markdown}
          </ReactMarkdown>
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
