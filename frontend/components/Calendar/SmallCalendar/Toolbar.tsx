import { ToolbarProps, Navigate, View } from 'react-big-calendar';
import { IconButton, Stack, Typography } from '@mui/material';
import { CustomToolbarProps } from '..';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function Toolbar(props: CustomToolbarProps) {
  const { label, localizer } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <Stack
      alignItems="center"
      direction="row"
      style={{ marginBottom: '1rem' }}
      spacing={1}
    >
      <IconButton onClick={() => navigate(Navigate.PREVIOUS)}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={() => navigate(Navigate.NEXT)}>
        <KeyboardArrowRight />
      </IconButton>
      <Typography style={{ textTransform: 'capitalize' }}>{label}</Typography>
    </Stack>
  );
}
