import { Typography, Stack } from '@mui/material';

export default function Widgets() {
  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%', marginTop: '2rem' }} justifyContent="center">
      <Stack>
        <Typography variant="h4">Senaste nyheterna</Typography>
        <p>hej</p>
        <p>fem</p>
      </Stack>
      <Stack>
        <Typography variant="h4">Kommande evenemang</Typography>
        <p>FEM</p>
      </Stack>
      <Stack>
        <Typography variant="h4">Senaste mötet</Typography>
        <p>FEM</p>
      </Stack>
    </Stack>
  );
}
