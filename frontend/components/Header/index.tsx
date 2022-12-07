import React, { PropsWithChildren } from 'react';
import {
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import routes from '~/routes';
import SearchInput from './SearchInput';
import DarkModeSelector from './components/DarkModeSelector';
import LanguageSelector from './components/LanguageSelector';
import AuthenticationStatus from './AuthenticationStatus';
import { useUser } from '~/providers/UserProvider';
import NotificationsBell from './components/NotificationsBell';
import MyCart from './components/MyCart';
import MyChest from './components/MyChest';
import Navigation from './components/Navigation';

function Layout({ children }: PropsWithChildren<{}>) {
  const theme = useTheme();
  const hideSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const router = useRouter();
  const { user } = useUser();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {(hideSmall && user) && (
      <SearchInput
        onSelect={(studentId) => {
          router.push(routes.member(studentId));
        }}
      />
      )}
      {user
      && (
      <>
        <MyCart />
        <MyChest />
      </>
      )}
      <LanguageSelector />
      <DarkModeSelector />
      {user && <NotificationsBell />}
      {children}
    </Stack>
  );
}

function Header() {
  // const classes = useHeaderStyles();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      padding={{ xs: '0.5rem', md: '1rem 2rem' }}
      spacing={{ xs: 1, md: 2 }}
      sx={{
        position: 'fixed',
        zIndex: 2,
        width: '100%',
        left: 0,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={2} width="100%">
        <Navigation />
      </Stack>
      <Layout>
        <AuthenticationStatus />
      </Layout>
    </Stack>
  );
}

export default Header;
