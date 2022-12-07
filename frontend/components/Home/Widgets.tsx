import { Typography, Stack } from '@mui/material';
import EventSet from '../Calendar/UpcomingEventSet';
import ArticleSet from '../News/articleSet';
import LatestMeeting from './LatestMeeting';

export default function Widgets() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 5 }} sx={{ width: '100%' }} justifyContent="center">
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="primary">Senaste nyheterna</Typography>
        <ArticleSet articlesPerPage={5} />
      </Stack>
      <Stack width="100%" spacing={2}>
        <Typography variant="h4" color="secondary">Kommande evenemang</Typography>
        <EventSet perPage={4} />
      </Stack>
      <Stack width="100%">
        <Typography variant="h4" color="primary">Senaste mötet</Typography>
        <LatestMeeting />
      </Stack>
    </Stack>
  );
}
