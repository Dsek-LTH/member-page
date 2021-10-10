import React, { useContext } from 'react';
import { Paper, Link as MuiLink } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { articleStyles } from '~/components/News/articlestyles';
import { DateTime } from 'luxon';
import Link from 'next/link';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import { EventQuery } from '~/generated/graphql';

export default function Event(props: EventQuery) {
  const classes = articleStyles();
  const { event } = props;
  const startDate = DateTime.fromISO(event.start_datetime);
  const endDate = DateTime.fromISO(event.end_datetime);
  const { t, i18n } = useTranslation('common');
  const { user, loading: userLoading } = useContext(UserContext);
  let markdown = event.description || '';

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
          <h3 className={classes.header}>{event.title}</h3>
          <ReactMarkdown children={markdown} />
        </Grid>

        <Grid item xs={12} className={classes.footer}>
          <br />
          <br />
          <span>Ansvarig: Olofmajster</span>
          <br />
          <span>{startDate.setLocale(i18n.language).toISODate()}</span>
          <br />
          <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
        </Grid>
      </Grid>
    </Paper>
  );
}
