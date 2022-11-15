import React from 'react';
import {
  Paper, Button, Typography, Stack, Divider,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { DateTime } from 'luxon';
import LinkIcon from '@mui/icons-material/Link';
import articleStyles from '~/components/News/articleStyles';
import Link from '~/components/Link';
import routes from '~/routes';
import {
  EventQuery,
  useSetGoingToEventMutation,
  useSetInterestedInEventMutation,
  useUnsetGoingToEventMutation,
  useUnsetInterestedInEventMutation,
} from '~/generated/graphql';
import BigCalendarDay from './BigCalendarDay';
import selectTranslation from '~/functions/selectTranslation';
import startAndEndDateToStringRows from '~/functions/startAndEndDateToStringRows';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { authorIsUser } from '~/functions/authorFunctions';
import { useUser } from '~/providers/UserProvider';
import GoingButton from '../Social/SocialButton/GoingButton';
import InterestedButton from '../Social/SocialButton/InterestedButton';
import PeopleGoing from '../Social/PeopleGoing/PeopleGoing';
import PeopleInterested from '../Social/PeopleInterested/PeopleInterested';
import Comments from '../Social/Comments/Comments';

export default function EventPage({ event, refetch }: { event: EventQuery['event'], refetch: () => void }) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const apiContext = useApiAccess();
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const stringRows = startAndEndDateToStringRows(startDate, endDate);
  const markdown = selectTranslation(i18n, event?.description, event?.description_en) || '';
  const [setGoing] = useSetGoingToEventMutation({ variables: { id: event.id } });
  const [unsetGoing] = useUnsetGoingToEventMutation({ variables: { id: event.id } });
  const [setInterested] = useSetInterestedInEventMutation({ variables: { id: event.id } });
  const [unsetInterested] = useUnsetInterestedInEventMutation({ variables: { id: event.id } });
  const { user } = useUser();

  function toggleGoing() {
    const promises: Promise<any>[] = [];
    if (event.iAmInterested) {
      promises.push(unsetInterested());
    }
    if (event.iAmGoing) {
      promises.push(unsetGoing());
    } else {
      promises.push(setGoing());
    }
    Promise.all(promises).then(() => refetch());
  }

  function toggleInterested() {
    const promises: Promise<any>[] = [];
    if (event.iAmInterested) {
      promises.push(unsetInterested());
    } else {
      promises.push(setInterested());
    }
    if (event.iAmGoing) {
      promises.push(unsetGoing());
    }
    Promise.all(promises).then(() => refetch());
  }

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
          <Stack
            sx={{ flexDirection: { sm: 'column', md: 'row' } }}
            width="100%"
            justifyContent="space-between"
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

          {(hasAccess(apiContext, 'event:update') || authorIsUser(event.author, user)) && (
            <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
          )}
        </Stack>
      </Grid>
      <Stack margin="1rem 0">
        <PeopleGoing peopleGoing={event.peopleGoing} />
        <PeopleInterested peopleInterested={event.peopleInterested} />
      </Stack>
      <Divider style={{ margin: '0.75rem 0' }} />
      <Stack
        direction="row"
        width="100%"
        alignItems="center"
        justifyContent="space-around"
      >
        <GoingButton access="event:social" iAmGoing={event.iAmGoing} toggleGoing={() => toggleGoing()} />
        <InterestedButton access="event:social" iAmInterested={event.iAmInterested} toggleInterested={() => toggleInterested()} />
      </Stack>
      <Divider style={{ margin: '0.75rem 0' }} />

      <Comments id={event.id} comments={event.comments} type="event" />
    </Paper>
  );
}
