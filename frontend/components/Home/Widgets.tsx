import { Typography, Stack } from '@mui/material';
import routes from '~/routes';
import EventSet from '../Calendar/UpcomingEventSet';
import Link from '../Link';
import ArticleSet from '../News/articleSet';
import DisplayMeeting from './DisplayMeeting';

export default function Widgets() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 5 }} sx={{ width: '100%' }} justifyContent="center">
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="primary">Senaste nyheterna</Typography>
        <ArticleSet articlesPerPage={5} />
        <Link href={routes.news}>Fler nyheter</Link>
      </Stack>
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="secondary">Kommande evenemang</Typography>
        <EventSet perPage={4} />
        <Link href={routes.calendar}>Till kalendern</Link>
      </Stack>
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="primary">Senaste mötet</Typography>
        <DisplayMeeting index={1} />
        <Typography variant="h4" color="primary">Nästa möte</Typography>
        <DisplayMeeting index={0} />
        <Link href={routes.documents}>Fler möteshandlingar</Link>
      </Stack>
    </Stack>
  );
}
