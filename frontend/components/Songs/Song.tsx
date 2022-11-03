import { Paper, Stack, Typography } from '@mui/material';
import { SongsQuery } from '~/generated/graphql';

export default function Song({ song }: { song: SongsQuery['getSongs'][number] }) {
  return (
    <Paper>
      <Stack padding="1rem">
        <Typography component="h1" variant="h4">
          {song.title}
        </Typography>
        <Typography>
          Melodi:
          {' '}
          {song.melody}
        </Typography>
        <Typography
          style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}
          dangerouslySetInnerHTML={{
            __html: song.lyrics,
          }}
        />
      </Stack>
    </Paper>
  );
}
