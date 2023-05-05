import {
  Badge,
  BottomNavigation, BottomNavigationAction, Box, Paper,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import navigationData from '~/components/Header/components/Navigation/data';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import { useNotificationsQuery } from '~/generated/graphql';

const navRoutes = navigationData.items;
// The pages shown in the bottom tab bar
const pages = ['news', 'events', 'guild', 'webshop'];

// Base routes which should not be directly mapped
// By default, any route not in pages will be mapped to guild
const specialRoutes = {
  calendar: 'events', // Is definitely part of events
  settings: 'account',
  account: 'account',
};

export default function BottomTabBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const loadedRoute = router.pathname.split('/')?.[1];
  const [currentPage, setPage] = useState(pages.includes(loadedRoute)
    ? loadedRoute
    : (specialRoutes[loadedRoute] ?? 'guild'));
  const apiContext = useApiAccess();

  useEffect(() => {
    const newLoadedRoute = router.pathname.split('/')?.[1];
    setPage(pages.includes(newLoadedRoute)
      ? newLoadedRoute
      : (specialRoutes[newLoadedRoute] ?? 'guild'));
  }, [router.pathname]);

  const { data } = useNotificationsQuery({
    pollInterval: 10000,
  });
  const unread = data?.myNotifications?.filter((n) => !n.readAt)?.length ?? 0;

  return (
    <Paper
      sx={{
        zIndex: 100,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
      }}
      elevation={0}
    >
      <BottomNavigation
        sx={{
          background: 'transparent',
          marginX: 1,
        }}
        value={currentPage}
        onChange={(_, value) => {
          router.push(routes[value === 'guild' ? 'root' : value]);
          setPage(value);
        }}

      >
        {pages.map((page) => {
          const item = navRoutes.find((i) => i.translationKey === page);

          return (
            <BottomNavigationAction
              key={page}
              label={page === 'guild' ? undefined : t(page)}
              disabled={!item.hasAccess(apiContext)}
              sx={{
                opacity: !item.hasAccess(apiContext) ? 0.5 : undefined,
                minWidth: '0px',
              }}
              icon={(
                <Box sx={{
                  transform: page === 'guild' ? 'scale(1.5)' : undefined,
                }}
                >
                  {item.icon}
                </Box>
)}
              value={page}
            />
          );
        })}
        <BottomNavigationAction
          label="Konto"
          value="account"
          sx={{
            minWidth: '0px',
          }}
          icon={(
            <Badge badgeContent={unread} color="error">
              <AccountCircleIcon color="primary" />
            </Badge>
)}
        />
      </BottomNavigation>

    </Paper>
  );
}
