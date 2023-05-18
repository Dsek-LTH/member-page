import { useState } from 'react';
import {
  IconButton, Stack, SwipeableDrawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import navigationData from './data';
import NavigationItem from './Item';
import NavigationItemMenu from './Menu';
import SearchInput from '../../SearchInput';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';

const MobileOnly = styled('div')(({ theme }) => `
  display: none;
  @media (max-width: ${theme.breakpoints.values.md}px) {
    display: block;
  }
`);

const DesktopOnly = styled('div')(({ theme }) => `
  display: block;
  @media (max-width: ${theme.breakpoints.values.md}px) {
    display: none;
  }
`);

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  return (
    <Stack>
      <DesktopOnly>
        <Stack
          direction="row"
          spacing={2}
          width="100%"
          sx={{
            '& > *': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          {navigationData.items.map((item) => {
            if (item.children) {
              return (
                <NavigationItemMenu
                  onItemClick={() => setDrawerOpen(false)}
                  key={item.translationKey}
                  item={item}
                />
              );
            }
            return (
              <NavigationItem
                onItemClick={() => setDrawerOpen(false)}
                key={item.translationKey}
                item={item}
              />
            );
          })}
        </Stack>
      </DesktopOnly>
      <MobileOnly>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon color="primary" fontSize="large" />
        </IconButton>
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <Stack
            sx={{ padding: '2rem' }}
            marginTop="3.5rem"
            spacing={2}
          >
            {user
            && (
            <SearchInput
              fullWidth
              onSelect={(studentId) => {
                setDrawerOpen(false);
                router.push(routes.member(studentId));
              }}
            />
            )}
            {' '}
            {navigationData.items.map((item) => {
              if (item.children) {
                return (
                  <NavigationItemMenu
                    key={item.translationKey}
                    item={item}
                    onItemClick={() => setDrawerOpen(false)}
                  />
                );
              }
              return (
                <NavigationItem
                  onItemClick={() => setDrawerOpen(false)}
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
