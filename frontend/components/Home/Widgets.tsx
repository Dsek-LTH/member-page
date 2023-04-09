import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import routes from '~/routes';
import EventSet from '../Calendar/UpcomingEventSet';
import Link from '../Link';
import ArticleSet from '../News/articleSet';
import DisplayMeeting from './DisplayMeeting';
import { fullWidth } from '~/styles/pageStyles';

export default function Widgets() {
  const { t } = useTranslation(['homePage']);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 5 }}
      sx={{
        ...fullWidth,
      }}
      justifyContent="center"
    >
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="primary">{t('homePage:latest_news')}</Typography>
        <ArticleSet articlesPerPage={5} />
        <Link href={routes.news}>{t('homePage:more_news')}</Link>
      </Stack>
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="secondary">{t('homePage:upcoming_events')}</Typography>
        <EventSet perPage={4} />
        <Link href={routes.calendar}>{t('homePage:to_calendar')}</Link>
      </Stack>
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="primary">{t('homePage:prev_meeting')}</Typography>
        <DisplayMeeting index={1} />
        <Typography variant="h4" color="primary">{t('homePage:next_meeting')}</Typography>
        <DisplayMeeting index={0} />
        <Link href={routes.documents}>{t('homePage:meeting_docs')}</Link>
      </Stack>
    </Stack>
  );
}
