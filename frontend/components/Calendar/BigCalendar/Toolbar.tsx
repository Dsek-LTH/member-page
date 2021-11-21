import { useState } from 'react';
import { Navigate, View, Messages } from 'react-big-calendar';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from 'react-i18next';
import Router from 'next/router';
import { CustomToolbarProps } from '../index';
import routes from '~/routes';

export default function Toolbar(props: CustomToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t, i18n } = useTranslation(['calendar', 'common', 'booking']);

  const { view } = props;

  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('md'));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (newView?) => {
    setAnchorEl(null);
    if (newView) {
      props.onView(newView);
    }
  };

  const { label } = props;

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
    <>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        style={{ marginBottom: '1rem' }}
        flexWrap="wrap"
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent={large ? '' : 'space-between'}
          width={large ? 'unset' : '100%'}
        >
          <Button onClick={() => navigate(Navigate.TODAY)} variant="outlined">
            {messages.today}
          </Button>
          <IconButton onClick={() => navigate(Navigate.PREVIOUS)}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={() => navigate(Navigate.NEXT)}>
            <KeyboardArrowRight />
          </IconButton>
          {large && (
            <IconButton onClick={() => Router.push(routes.createEvent)}>
              <ControlPointIcon />
            </IconButton>
          )}
          {!large && (
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
          )}
        </Stack>
        {!large && (
          <Stack direction="row">
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showEvents}
                  onChange={(event) => {
                    props.setShowEvents(event.target.checked);
                  }}
                />
              }
              label={t('common:events').toString()}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showBookings}
                  onChange={(event) => {
                    props.setShowBookings(event.target.checked);
                  }}
                />
              }
              label={t('booking:bookings').toString()}
            />
            <IconButton onClick={() => Router.push(routes.createEvent)}>
              <ControlPointIcon />
            </IconButton>
          </Stack>
        )}
        {large && (
          <Stack direction="row">
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showEvents}
                  onChange={(event) => {
                    props.setShowEvents(event.target.checked);
                  }}
                />
              }
              label={t('common:events').toString()}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showBookings}
                  onChange={(event) => {
                    props.setShowBookings(event.target.checked);
                  }}
                />
              }
              label={t('booking:bookings').toString()}
            />
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
          </Stack>
        )}

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
      <Stack
        alignItems="center"
        justifyContent="center"
        direction="row"
        style={{ marginBottom: '1rem' }}
      >
        <Typography style={{ textTransform: 'capitalize' }}>{label}</Typography>
      </Stack>
    </>
  );
}
