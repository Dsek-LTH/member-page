import React, { useContext } from 'react';
import { Paper, Link as MuiLink, Button, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { articleStyles } from '~/components/News/articlestyles';
import { DateTime } from 'luxon';
import Link from 'next/link';
import LinkIcon from '@mui/icons-material/Link';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import { EventQuery } from '~/generated/graphql';
import BigCalendarDay from './BigCalendarDay';

export default function EventCard({ event }: { event: EventQuery['event'] }) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const english = i18n.language === 'en';
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const { user, loading: userLoading } = useContext(UserContext);
  let markdown =
    (english && event.description_en
      ? event.description_en
      : event.description) || '';

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
          <BigCalendarDay day={startDate.day} />
          <Typography color="primary" variant="h5" marginTop="1rem">
            {startDate.toLocaleString(DateTime.DATETIME_MED)} -{' '}
            {endDate.toLocaleString(DateTime.DATETIME_MED)}
          </Typography>
          <h3 style={{ marginBottom: '1rem' }} className={classes.header}>
            {english && event.title_en ? event.title_en : event.title}
          </h3>
          {event.link && (
            <MuiLink
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outlined" startIcon={<LinkIcon />}>
                {t('event:link_to_event')}
              </Button>
            </MuiLink>
          )}
          <ReactMarkdown children={markdown} />
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
            {' '}
            {t('event:organizer')}: {event.organizer}
          </span>
          <br />
          <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
        </Grid>
      </Grid>
    </Paper>
  );
}
