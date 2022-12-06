import { Stack, Button } from '@mui/material';
import DsekIcon from '~/components/Icons/DsekIcon';

export default function ProgramInfo({ name }) {
  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <DsekIcon />
      <Stack>
        {name}
        <Button>
          LÄS MER
        </Button>
      </Stack>
    </Stack>
  );
}
