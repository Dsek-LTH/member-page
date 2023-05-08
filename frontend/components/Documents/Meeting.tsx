import ArticleIcon from '@mui/icons-material/Article';
import
{
  Button, Paper,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { Meeting } from './proccessFilesData';

const MeetingPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-top: 1rem;
  overflow-wrap: anywhere;
`;

export default function MeetingComponent({ meeting }: { meeting: Meeting }) {
  return (
    <MeetingPaper key={meeting.title}>
      <h2 style={{ margin: 0 }}>{meeting.title}</h2>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2,
      }}
      >
        {meeting.files.map((file) => (
          <Button
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            href={file.thumbnailUrl}
            key={`file-${file.name}`}
            download
            sx={{
              overflowWrap: 'anywhere',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              justifyContent: 'flex-start',
            }}
          >
            <ArticleIcon style={{ marginRight: '0.5rem' }} />
            {file.name.replaceAll('_', ' ')}
          </Button>
        ))}
      </Box>
    </MeetingPaper>
  );
}
