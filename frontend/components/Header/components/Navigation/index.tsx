import { useState } from 'react';
import {
  IconButton, Stack, SwipeableDrawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import navigationData from './data';
import NavigationItem from './Item';
import NavigationItemMenu from './Menu';

const MobileOnly = styled('div')`
  display: none;
  @media (max-width: 959px) {
    display: block;
  }
`;

const DesktopOnly = styled('div')`
  display: block;
  @media (max-width: 959px) {
    display: none;
  }
`;

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event
      && event.type === 'keydown'
      && ((event as React.KeyboardEvent).key === 'Tab'
        || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };
  return (
    <Stack>
      <DesktopOnly>
        <Stack direction="row" spacing={2} width="100%">
          {navigationData.items.map((item) => {
            if (item.children) {
              return (
                <NavigationItemMenu
                  onItemClick={toggleDrawer(false)}
                  key={item.translationKey}
                  item={item}
                />
              );
            }
            return (
              <NavigationItem
                onItemClick={toggleDrawer(false)}
                key={item.translationKey}
                item={item}
              />
            );
          })}
        </Stack>
      </DesktopOnly>
      <MobileOnly>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon color="primary" fontSize="large" />
        </IconButton>
        <SwipeableDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
          <Stack
            sx={{ padding: '2rem' }}
            marginTop="3.5rem"
            spacing={2}
            onKeyDown={toggleDrawer(false)}
          >
            {navigationData.items.map((item) => {
              if (item.children) {
                return (
                  <NavigationItemMenu
                    key={item.translationKey}
                    item={item}
                    onItemClick={toggleDrawer(false)}
                  />
                );
              }
              return (
                <NavigationItem
                  onItemClick={toggleDrawer(false)}
                  key={item.translationKey}
                  item={item}
                />
              );
            })}
          </Stack>
        </SwipeableDrawer>
      </MobileOnly>
    </Stack>

  );
}
