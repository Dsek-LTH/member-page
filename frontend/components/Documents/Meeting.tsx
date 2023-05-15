import ArticleIcon from '@mui/icons-material/Article';
import
{
  Button, Paper, Tooltip, Typography,
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
        {meeting.files.map((file) => {
          const title = file.name.replaceAll('_', ' ');

          return (
            <Tooltip
              key={`file-${file.name}`}
              title={<Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{title.substring(0, 1).toUpperCase() + title.substring(1)}</Typography>}
            >
              <Button
                variant="contained"
                target="_blank"
                rel="noopener noreferrer"
                href={file.thumbnailUrl}
                download
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  justifyContent: 'flex-start',
                }}
              >
                <ArticleIcon style={{ marginRight: '0.5rem' }} />
                <Box sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
                >
                  {title}
                </Box>
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </MeetingPaper>
  );
}
