import AdjustIcon from '@mui/icons-material/Adjust';
import LinkIcon from '@mui/icons-material/Link';
import
{
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper, Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Link from '~/components/Link';
import articleStyles from '~/components/News/articleStyles';
import Comments from '~/components/Social/Comments/Comments';
import GoingButton from '~/components/Social/SocialButton/GoingButton';
import InterestedButton from '~/components/Social/SocialButton/InterestedButton';
import selectTranslation from '~/functions/selectTranslation';
import startAndEndDateToStringRows from '~/functions/startAndEndDateToStringRows';
import
{
  EventQuery,
  EventsQuery,
  useSetGoingToEventMutation,
  useSetInterestedInEventMutation,
  useUnsetGoingToEventMutation,
  useUnsetInterestedInEventMutation,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Markdown from '../Markdown';
import PeopleGoing from '../Social/PeopleGoing/PeopleGoing';
import PeopleInterested from '../Social/PeopleInterested/PeopleInterested';
import BigCalendarDay from './BigCalendarDay';

const eventOngoing = (startDate: DateTime, endDate: DateTime): boolean => {
  const now = DateTime.now().toMillis();
  const start = startDate.toMillis();
  const end = endDate.toMillis();
  return start < now && end > now;
};

export function SmallEventCard({ event }) {
  const { i18n } = useTranslation('common');
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const stringRows = startAndEndDateToStringRows(startDate, endDate);
  const header = selectTranslation(i18n, event?.title, event?.title_en);

  return (
    <Paper component="article" sx={{ p: 1 }}>
      <Link href={routes.event(event.slug || event.id)}>
        <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
          <BigCalendarDay day={startDate.day} month={startDate.month} small />

          <Stack flex={1} sx={{ overflow: 'hidden' }}>
            <Stack spacing={0.5} direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={2} overflow="hidden">
                <Typography
                  sx={{
                    fontSize: '0.7em',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {stringRows.row1}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.7em', whiteSpace: 'nowrap', overflow: 'hidden',
                  }}
                >
                  {stringRows.row2}
                </Typography>

              </Stack>
            </Stack>

            {/* Header */}
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {header}
            </Typography>
          </Stack>

          {eventOngoing(startDate, endDate) && (
          <AdjustIcon color="error" sx={{ fontSize: '2rem' }} />
          )}
        </Stack>
      </Link>
    </Paper>
  );
}

export default function EventCard({
  event,
  showFull,
  refetch,
  small,
}: {
  event: EventsQuery['events']['events'][number] | EventQuery['event'];
  refetch: () => void;
  showFull?: boolean;
  small?: boolean;
}) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation(['common', 'event']);
  const startDate = DateTime.fromISO(event.start_datetime).setLocale(
    i18n.language,
  );
  const endDate = DateTime.fromISO(event.end_datetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const stringRows = startAndEndDateToStringRows(startDate, endDate);
  const [setGoing] = useSetGoingToEventMutation({ variables: { id: event.id } });
  const [unsetGoing] = useUnsetGoingToEventMutation({ variables: { id: event.id } });
  const [setInterested] = useSetInterestedInEventMutation({ variables: { id: event.id } });
  const [unsetInterested] = useUnsetInterestedInEventMutation({ variables: { id: event.id } });
  const markdown = selectTranslation(i18n, event?.description, event?.description_en) || '';
  const [showAll, setShowAll] = useState(false);
  const isScreenLarge = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
  const isScreenSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const isLarge = isScreenLarge && !small;
  const isSmall = isScreenSmall || small;

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

  const topPart = (
    <Stack
      direction={isLarge ? 'row' : 'column'}
      width="100%"
      justifyContent="space-between"
      gap={2}
    >
      <Stack direction="row" spacing={4}>
        {!isSmall && <BigCalendarDay day={startDate.day} month={startDate.month} />}
        <Stack>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography
              variant="h4"
              color="text.primary"
              component="h1"
              style={{ whiteSpace: 'normal' }}
            >
              <Link
                href={routes.event(event.slug || event.id)}
                style={{ textDecoration: 'none' }}
                color="inherit"
              >
                {selectTranslation(i18n, event?.title, event?.title_en)}
              </Link>
            </Typography>
            {eventOngoing(startDate, endDate) && (
              isLarge ? (
                <Chip
                  sx={{ cursor: 'inherit' }}
                  icon={<AdjustIcon />}
                  label={t('event:event_ongoing')}
                  variant="outlined"
                  color="error"
                />
              ) : <AdjustIcon color="error" sx={{ fontSize: '2rem' }} />
            )}
          </Stack>
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
        </Stack>
      </Stack>
      <Stack gap={1}>
        {event.link && (
        <Link href={event.link} newTab>
          <Button variant="outlined" startIcon={<LinkIcon />}>
            {t('event:link_to_event')}
          </Button>
        </Link>
        )}
        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          gap={1}
        >
          <GoingButton access="event:social" iAmGoing={event.iAmGoing} toggleGoing={() => toggleGoing()} />
          <InterestedButton access="event:social" iAmInterested={event.iAmInterested} toggleInterested={() => toggleInterested()} />
        </Stack>
      </Stack>
    </Stack>
  );

  const basicInfo = (
    <Stack
      justifyContent={isSmall ? 'space-between' : 'start'}
      direction={isSmall ? 'row' : 'column'}
      alignItems={isSmall ? 'center' : 'flex-start'}
      paddingRight={4}
      marginTop={2}
      gap={1}
    >
      {event.location && (
      <Typography variant="body2" whiteSpace="nowrap">
        <Typography fontWeight="bold">
          {t('event:location')}
        </Typography>
        {event.location}
      </Typography>
      )}
      <Typography variant="body2" whiteSpace="nowrap">
        <Typography fontWeight="bold">
          {t('event:organizer')}
        </Typography>
        {event.organizer}
      </Typography>

      {(hasAccess(apiContext, 'event:update') || event.author?.id === user?.id) && (
        <Link href={routes.editEvent(event.id)}>{t('edit')}</Link>
      )}
    </Stack>
  );

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
          {topPart}
          <Stack sx={{ flexDirection: isSmall ? 'column' : 'row' }}>
            {basicInfo}
            <Box sx={{
              flexGrow: 1,
              maxWidth: '75ch',
              maxHeight: showFull ? undefined : '160px',
              overflow: 'hidden',
              position: 'relative',
              maskImage: showFull ? undefined : 'linear-gradient(to bottom, black 130px, transparent 155px, transparent)',
            }}
            >
              <Markdown content={markdown} />
            </Box>
          </Stack>
          {!showFull && (
            <Link href={routes.event(event.id)}>
              {t('read_more')}
            </Link>
          )}
        </Grid>
      </Grid>
      {/* Bottom part */}
      <Stack marginTop={1}>
        <PeopleGoing peopleGoing={event.peopleGoing} />
        <PeopleInterested peopleInterested={event.peopleInterested} />
      </Stack>
      {showFull && (
      <>
        <Divider style={{ margin: '0.75rem 0' }} />

        {'comments' in event && <Comments id={event.id} showAll={showAll} setShowAll={setShowAll} comments={event.comments} type="event" />}
      </>
      )}
    </Paper>
  );
}
