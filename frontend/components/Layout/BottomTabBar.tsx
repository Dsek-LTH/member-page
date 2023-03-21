import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import navigationData from '~/components/Header/components/Navigation/data';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

const navRoutes = navigationData.items;
// The pages shown in the bottom tab bar
const pages = ['news', 'events', 'guild', 'webshop'];

// Base routes which should not be directly mapped
// By default, any route not in pages will be mapped to guild
const specialRoutes = {
  calendar: 'events', // Is definitely part of events
  members: '', // In my opinion should not be part of guild page
  settings: '', // In my opinion should not be part of guild page
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

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'red',
      }}
      elevation={3}
    >
      <BottomNavigation
        sx={{ paddingY: 4 }}
        showLabels
        value={currentPage}
        onChange={(_, value) => {
          router.push(routes[value]);
          setPage(value);
        }}
      >
        {pages.map((page) => {
          const item = navRoutes.find((i) => i.translationKey === page);
          if (!item.hasAccess(apiContext)) {
            return null;
          }
          return (
            <BottomNavigationAction
              key={page}
              label={t(page)}
              icon={item.icon}
              value={page}
            />
          );
        })}
      </BottomNavigation>

    </Paper>
  );
}
