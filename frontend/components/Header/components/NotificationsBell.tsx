import React, { useState } from 'react';
import {
  Badge, Divider, IconButton, Menu, MenuItem, Paper, Stack, Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotificationsQuery, useMarkAsReadMutation, useDeleteNotificationsMutation } from '~/generated/graphql';
import Link from '~/components/Link';

function NotificationsBell({ small }: { small?: boolean }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data, refetch } = useNotificationsQuery({
    pollInterval: 10000,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();
  const { i18n } = useTranslation();
  if (!data?.myNotifications) return null;
  const { length } = data.myNotifications;
  const { length: unread } = data.myNotifications.filter((n) => !n.readAt);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (unread > 0) {
      markAsRead({
        variables: {
          ids: data.myNotifications.filter((n) => !n.readAt).map((n) => n.id),
        },
      });
    }
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
          <NotificationsIcon fontSize={small ? 'small' : undefined} />
        </Badge>
      </IconButton>
      <Menu
        disableScrollLock
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          sx: {
            maxHeight: '90vh',
          },
        }}
        PaperProps={{
          style: {
          },
        }}
      >
        {length === 0 && <MenuItem>Inga notiser</MenuItem>}
        {data.myNotifications.map((notification) => (
          <Stack key={notification.id} direction="row" alignItems="center" justifyContent="space-between" paddingRight="0.5rem">
            <Link color="text.primary" href={notification.link} style={{ flexGrow: 1 }}>
              <MenuItem
                sx={{ maxWidth: '450px', whiteSpace: 'break-spaces' }}
                onClick={handleClose}
              >
                <Stack>
                  <Typography fontWeight="bold">{notification.title}</Typography>
                  <Typography fontSize="0.8em">{notification.message}</Typography>
                  {date(notification.createdAt)}
                </Stack>
              </MenuItem>
            </Link>
            <IconButton
              onClick={() => {
                deleteNotifications({
                  variables: {
                    ids: [notification.id],
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
        {length > 0
        && (
          <Stack sx={{
            position: 'sticky',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
          }}
          >
            <Divider />
            <Paper sx={{ borderRadius: 0, boxShadow: 'none' }} elevation={8} square>
              <MenuItem
                onClick={() => {
                  deleteNotifications({
                    variables: {
                      ids: data.myNotifications.map((n) => n.id),
                    },
                  }).then(() => {
                    refetch();
                    handleClose();
                  });
                }}
              >
                <DeleteIcon />
                {' '}
                Rensa alla
              </MenuItem>
            </Paper>

          </Stack>

        )}

      </Menu>
    </>
  );
}

export default NotificationsBell;
