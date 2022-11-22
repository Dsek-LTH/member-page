import {
  Stack,
  Paper,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import { MyChestQuery } from '~/generated/graphql';

export default function ChestItem({ item }: {
  item: MyChestQuery['chest']['items'][number]
}) {
  const consumed = !!item.consumedAt;
  return (
    <Paper key={item.id} sx={{ marginBottom: '1rem', width: 'fit-content' }}>
      <Stack direction="row" alignItems="center" spacing={2} padding={2} sx={{ width: 'fit-content' }}>
        <Avatar src={item.imageUrl} />
        <Typography variant="h5">
          {item.name}
          {item.variant ? `: ${item.variant}` : ''}
        </Typography>
        {!consumed && <Button variant="contained">Förbruka</Button>}
        {consumed && (
        <Typography>
          Förbrukad:
          {' '}
          {item.consumedAt}
        </Typography>
        )}
      </Stack>
    </Paper>
  );
}
