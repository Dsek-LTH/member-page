import { Paper, Stack, Typography } from '@mui/material';
import { SongsQuery } from '~/generated/graphql';
import routes from '~/routes';
import Link from '../Link';

export default function Song({ song }: { song: SongsQuery['songs'][number] }) {
  return (
    <Link href={routes.song(song.title)} style={{ width: '100%' }}>
      <Paper style={{ width: '100%' }}>
        <Stack padding="1rem">
          <Typography component="h1" variant="h4">
            {song.title}
          </Typography>
          <Typography>
            Categori:
            {' '}
            {song.category}
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
    </Link>

  );
}
