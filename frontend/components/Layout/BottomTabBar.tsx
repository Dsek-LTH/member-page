import
{
  BottomNavigation, BottomNavigationAction, Box, Paper,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import navigationData from '~/components/Header/components/Navigation/data';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

const navRoutes = navigationData.items;
// The pages shown in the bottom tab bar
export const APP_PAGES = ['news', 'events', 'guild', 'webshop'];

// Base routes which should not be directly mapped
// By default, any route not in pages will be mapped to guild
export const APP_SPECIAL_ROUTES = {
  calendar: 'events', // Is definitely part of events
  settings: 'account',
  account: 'account',
};

export default function BottomTabBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const loadedRoute = router.pathname.split('/')?.[1];
  const [currentPage, setPage] = useState(APP_PAGES.includes(loadedRoute)
    ? loadedRoute
    : (APP_SPECIAL_ROUTES[loadedRoute] ?? 'guild'));
  const apiContext = useApiAccess();

  useEffect(() => {
    const newLoadedRoute = router.pathname.split('/')?.[1];
    setPage(APP_PAGES.includes(newLoadedRoute)
      ? newLoadedRoute
      : (APP_SPECIAL_ROUTES[newLoadedRoute] ?? 'guild'));
  }, [router.pathname]);

  return (
    <Paper
      elevation={4}
      sx={{
        zIndex: 100,
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
      }}
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
        {APP_PAGES.map((page) => {
          let item = navRoutes.find((i) => i.translationKey === page);
          if (!item) {
            navRoutes.forEach((route) => {
              if (route.children) {
                const found = route.children.find((i) => i.translationKey === page);
                if (found) item = found;
              }
            });
            if (!item) return null;
          }

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
            <AccountCircleIcon color="primary" />
          )}
        />
      </BottomNavigation>

    </Paper>
  );
}
