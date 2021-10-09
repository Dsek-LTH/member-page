import { useState } from 'react';
import { ToolbarProps, Navigate, View, Messages } from 'react-big-calendar';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import {
  Navigation,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import Router from 'next/router';

export default function Toolbar(props: ToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t, i18n } = useTranslation('calendar');

  const { view } = props;
  const date = DateTime.fromJSDate(props.date).setLocale(i18n.language);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (newView?) => {
    setAnchorEl(null);
    if (newView) {
      props.onView(newView);
    }
  };

  const { localizer, label } = props;

  const messages: Messages = {
    month: t('month'),
    week: t('week'),
    day: t('day'),
    today: t('today'),
  };

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
        <IconButton onClick={() => Router.push('/event/create')}>
          <ControlPointIcon />
        </IconButton>
      </Stack>

      <Typography style={{ textTransform: 'capitalize' }}>{label}</Typography>

      <Button
        style={{ minWidth: '6rem' }}
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
      >
        {messages[view]}
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
