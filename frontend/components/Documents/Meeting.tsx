import ArticleIcon from '@mui/icons-material/Article';
import {
  Button, Paper,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { Meeting } from './proccessFilesData';

const MeetingPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-top: 1rem;
`;

const File = styled(Box)`
  margin-top: 1rem;
`;

export default function MeetingComponent({ meeting }: { meeting: Meeting }) {
  return (
    <MeetingPaper key={meeting.title}>
      <h2 style={{ marginTop: 0 }}>{meeting.title}</h2>
      {meeting.files.map((file) => (
        <File key={`file-${file.name}`}>
          <Button variant="contained" target="_blank" rel="noopener noreferrer" href={file.thumbnailUrl} download>
            <ArticleIcon style={{ marginRight: '0.5rem' }} />
            {file.name}
          </Button>
        </File>
      ))}
    </MeetingPaper>
  );
}
