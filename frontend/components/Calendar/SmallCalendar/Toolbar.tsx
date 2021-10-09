import { useState } from 'react';
import { ToolbarProps, Navigate, View } from 'react-big-calendar';
import { IconButton, Stack, Typography } from '@material-ui/core';

import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

function Toolbar(props: ToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { label, localizer } = props;
  const { messages } = localizer;

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

export default Toolbar;
