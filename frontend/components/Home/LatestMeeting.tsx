import { CircularProgress } from '@mui/material';
import { useFilesQuery } from '~/generated/graphql';
import MeetingComponent from '../Documents/Meeting';
import processFilesData from '../Documents/proccessFilesData';

const thisYear = new Date().getFullYear().toString();

export default function LatestMeeting() {
  const { data } = useFilesQuery({ variables: { bucket: 'documents', prefix: `public/${thisYear}`, recursive: true } });
  const meetings = processFilesData(thisYear, data?.files || [])
    .filter((m) => m.modDate).sort((a, b) => (a.modDate < b.modDate ? 1 : -1));
  // sort meetings after date

  const latestMeeting = meetings[0];
  if (!latestMeeting) return <CircularProgress />;
  return (
    <MeetingComponent meeting={latestMeeting} />
  );
}
