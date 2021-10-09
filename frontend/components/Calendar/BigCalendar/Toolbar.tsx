import { useState } from 'react';
import { ToolbarProps, Navigate, View } from 'react-big-calendar';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@material-ui/core';

import {
  Navigation,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';

function Toolbar(props: ToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newView?) => {
    setAnchorEl(null);
    if (newView) {
      props.onView(newView);
    }
  };

  const { label, localizer } = props;
  const { messages } = localizer;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      style={{ marginBottom: '1rem' }}
    >
      <Stack spacing={2} direction="row">
        <Button onClick={() => navigate(Navigate.TODAY)} variant="outlined">
          {messages.today}
        </Button>
        <IconButton onClick={() => navigate(Navigate.PREVIOUS)}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={() => navigate(Navigate.NEXT)}>
          <KeyboardArrowRight />
        </IconButton>
      </Stack>

      <Typography>{label}</Typography>

      <Button
        style={{ minWidth: '6rem' }}
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
      >
        {props.view}
      </Button>

      <Menu
        id="basic-menu"
        open={open}
        onClose={() => handleClose()}
        anchorEl={anchorEl}
      >
        {['month', 'week', 'day'].map((name) => (
          <MenuItem
            key={name}
            value={name}
            onClick={() => handleClose(name)}
            style={{ minWidth: '6rem' }}
          >
            {messages[name]}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}

export default Toolbar;
