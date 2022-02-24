import React, { useState } from 'react';
import { Navigate, Messages } from 'react-big-calendar';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from 'react-i18next';
import Router from 'next/router';
import Link from 'next/link';
import { CustomToolbarProps } from '../index';
import routes from '~/routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import copyTextToClipboard from '~/functions/copyTextToClipboard';

export default function Toolbar({
  label,
  showBookings,
  showEvents,
  view,
  onNavigate,
  onView,
  setShowBookings,
  setShowEvents,
}: CustomToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSubscribe, setAnchorElSubscribe] = useState(null);
  const open = Boolean(anchorEl);
  const subscribeOpen = Boolean(anchorElSubscribe);
  const { t, i18n } = useTranslation(['calendar', 'common', 'booking']);
  const subscribeUrl = typeof window !== 'undefined' ? `${window.location.origin}${routes.calendarDownload(i18n.language)}` : '';

  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('md'));
  const medium = useMediaQuery(theme.breakpoints.up('sm'));
  const apiContext = useApiAccess();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubscribeClick = (event) => {
    setAnchorElSubscribe(event.currentTarget);
  };
  const handleClose = (newView?) => {
    setAnchorEl(null);
    if (newView) {
      onView(newView);
    }
  };

  const handleSubscribeClose = () => {
    setAnchorElSubscribe(null);
  };

  const messages: Messages = {
    month: t('month'),
    week: t('week'),
    day: t('day'),
    today: t('today'),
  };

  const navigate = (action) => {
    onNavigate(action);
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
          {large && hasAccess(apiContext, 'event:create') && (
            <IconButton onClick={() => Router.push(routes.createEvent)}>
              <ControlPointIcon />
            </IconButton>
          )}
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
        {!large && (
          <Stack
            direction={medium ? 'row' : 'column'}
            marginTop={medium ? '' : '1rem'}
            justifyContent="center"
            width="100%"
            spacing={1}
          >
            <Button variant="outlined" onClick={handleSubscribeClick}>
              {t('common:subscribe')}
            </Button>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={showEvents}
                  onChange={(event) => {
                    setShowEvents(event.target.checked);
                  }}
                />
              )}
              label={t('common:events').toString()}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={showBookings}
                  onChange={(event) => {
                    setShowBookings(event.target.checked);
                  }}
                />
              )}
              label={t('booking:bookings').toString()}
            />
            {medium && hasAccess(apiContext, 'event:create') && (
              <Link href={routes.createEvent} passHref>
                <IconButton onClick={() => Router.push(routes.createEvent)}>
                  <ControlPointIcon />
                </IconButton>
              </Link>
            )}
            {!medium && hasAccess(apiContext, 'event:create') && (
              <Link href={routes.createEvent} passHref>
                <Button variant="outlined">
                  {t('calendar:addEvent')}
                </Button>
              </Link>
            )}
          </Stack>
        )}
        {large && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleSubscribeClick}>
              {t('common:subscribe')}
            </Button>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={showEvents}
                  onChange={(event) => {
                    setShowEvents(event.target.checked);
                  }}
                />
              )}
              label={t('common:events').toString()}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={showBookings}
                  onChange={(event) => {
                    setShowBookings(event.target.checked);
                  }}
                />
              )}
              label={t('booking:bookings').toString()}
            />
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
        <Popover
          open={subscribeOpen}
          anchorEl={anchorElSubscribe}
          onClose={handleSubscribeClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Stack padding="0.5rem">
            <Typography paddingBottom="0.5rem">
              {t('calendar:copyAndPasteToCalendarProgram')}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                value={subscribeUrl}
                fullWidth
              />
              <div>
                <IconButton onClick={() => copyTextToClipboard(subscribeUrl)}>
                  <ContentCopyIcon />
                </IconButton>
              </div>
            </Stack>
          </Stack>
        </Popover>
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
