import React, { useState, useEffect } from 'react';
import {
  Badge, IconButton, Menu, MenuItem, Stack,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotificationsQuery, useMarkAsReadMutation, useDeleteNotificationMutation } from '~/generated/graphql';
import Link from '~/components/Link';

function NotificationsBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data, refetch } = useNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);
  if (!data?.myNotifications) return null;
  const { length } = data.myNotifications;
  const { length: unread } = data.myNotifications.filter((n) => !n.readAt);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    markAsRead({
      variables: {
        ids: data.myNotifications.filter((n) => !n.readAt).map((n) => n.id),
      },
    });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const date = (d: string) => DateTime.fromISO(d).setLocale(i18n.language).toRelative();
  return (
    <>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {length === 0 && <MenuItem>Inga notiser</MenuItem>}
        {data.myNotifications.map((notification) => (
          <Stack key={notification.id} direction="row" alignItems="center">
            <Link color="white" href={notification.link}>
              <MenuItem
                sx={{ maxWidth: '450px', whiteSpace: 'break-spaces' }}
                onClick={handleClose}
              >
                {notification.message}
                {' '}
                {date(notification.createdAt)}
              </MenuItem>
            </Link>
            <IconButton
              onClick={() => {
                deleteNotification({
                  variables: {
                    id: notification.id,
                  },
                }).then(() => {
                  refetch();
                });
              }}
              sx={{ height: 'fit-content' }}
            >
              <DeleteIcon />

            </IconButton>
          </Stack>
        ))}
      </Menu>
    </>
  );
}

export default NotificationsBell;
