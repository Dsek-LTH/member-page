import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import
{
  Avatar,
  AvatarGroup,
  Badge, Box, Divider, IconButton,
  ListItemIcon,
  Menu, MenuItem, Paper, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Link from '~/components/Link';
import
{
  Notification,
  useDeleteNotificationsMutation,
  useMarkAsReadMutation,
  useNotificationsQuery,
} from '~/generated/graphql';

function NotificationsBell({ small }: { small?: boolean }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data, refetch } = useNotificationsQuery({
    pollInterval: 10000,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();
  const { length } = data?.myNotifications ?? { length: 0 };
  const unread = data?.myNotifications?.filter((n) => !n.readAt)?.length ?? 0;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (unread > 0) {
      markAsRead({
        variables: {
          ids: data?.myNotifications?.filter((n) => !n.readAt).flatMap((n) => n.groupedIds ?? n.id),
        },
      });
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
        {length === 0 && <MenuItem disabled>Inga notiser</MenuItem>}
        {data?.myNotifications?.map((notification) => (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <NotificationItem
            key={notification.id}
            notification={notification}
            handleClose={handleClose}
            markAsRead={() => {
              markAsRead({
                variables: {
                  ids: notification.groupedIds ?? [notification.id],
                },
              });
            }}
            refetch={refetch}
          />
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
                      ids: data.myNotifications.flatMap((n) => n.groupedIds ?? n.id),
                    },
                  }).then(() => {
                    refetch();
                    handleClose();
                  });
                }}
                // sx={{ px: 1 }}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                Rensa alla
              </MenuItem>
            </Paper>

          </Stack>

        )}

      </Menu>
    </>
  );
}

function NotificationItem({
  notification, handleClose, markAsRead, refetch,
}: {
  notification: Notification,
  handleClose: () => void,
  markAsRead: () => Promise<any> | void,
  refetch: () => Promise<any> | void,
}) {
  const { i18n } = useTranslation();
  const date = (d: string) => DateTime.fromISO(d).setLocale(i18n.language).toRelative();
  const [deleteNotifications] = useDeleteNotificationsMutation();
  return (
    <Box sx={{ position: 'relative' }}>
      <Link
        color="text.primary"
        href={notification.link}
        style={{ flexGrow: 1 }}
        onClick={markAsRead}
      >
        <MenuItem
          sx={{ maxWidth: '450px', whiteSpace: 'break-spaces', pl: 1 }}
          onClick={handleClose}
        >
          <Stack direction="row">
            <ListItemIcon sx={{ mr: 1 }}>
              <AvatarGroup
                max={2}
                total={notification.members?.length}
                sx={{
                  flexDirection: 'column-reverse',
                  justifyContent: 'flex-end',
                  '& >:last-child': {
                    marginTop: 0,
                  },
                  '& >:not(:last-child)': {
                    marginTop: -1,
                    marginLeft: 0,
                  },
                }}
              >
                {notification.members?.slice(0, 2)?.map((member) => (
                  <Avatar src={member?.picture_path} key={member.id} />
                ))}
              </AvatarGroup>
            </ListItemIcon>
            <Stack>
              <Typography fontWeight="bold">{notification.title}</Typography>
              <Typography fontSize="0.8em">{notification.message}</Typography>
              {date(notification.createdAt)}
            </Stack>
          </Stack>
        </MenuItem>
      </Link>
      <IconButton
        onClick={() => {
          deleteNotifications({
            variables: {
              ids: notification.groupedIds ?? [notification.id],
            },
          }).then(() => {
            refetch();
          });
        }}
        sx={{
          position: 'absolute',
          bottom: '0.5rem',
          right: '0.5rem',
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

    </Box>
  );
}

export default NotificationsBell;
