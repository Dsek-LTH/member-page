import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import
{
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { APP_PAGES } from '~/components/Layout/BottomTabBar';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import { usePageName } from '~/providers/PageNameProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import AuthenticationStatus from './AuthenticationStatus';
import SearchInput from './SearchInput';
import DarkModeSelector from './components/DarkModeSelector';
import LanguageSelector from './components/LanguageSelector';
import MyCart from './components/MyCart';
import MyChest from './components/MyChest';
import Navigation from './components/Navigation';
import NotificationsBell from './components/NotificationsBell';

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
function AppHeader() {
  const router = useRouter();
  const loadedRoute = router.pathname.split('/')?.[1];
  const isBaseRoute = router.pathname.split('/').length === 2;
  const canGoBack = !((isBaseRoute && [...APP_PAGES, 'account'].includes(loadedRoute)) || loadedRoute.length === 0);
  const { shortName: pageName } = usePageName();

  return (
    <Paper
      square
      elevation={4}
      sx={{
        py: 0.5,
        px: 1,
        position: 'relative',
        zIndex: 100,
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        columnGap={2}
      >
        <Box sx={{
          flexBasis: 0,
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'start',
        }}
        >
          <IconButton
            color="inherit"
            disabled={!canGoBack}
            onClick={() => {
              router.back();
            }}
          >
            {canGoBack && (
            <ArrowBackIosNewIcon sx={{
              fontSize: '1rem',
            }}
            />
            )}
          </IconButton>
        </Box>
        <Typography sx={{
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1,
        }}
        >
          {pageName}
        </Typography>
        <Box sx={{
          flexBasis: 0, flexGrow: 1, display: 'flex', justifyContent: 'end',
        }}
        >
          <NotificationsBell small />
        </Box>
      </Stack>
    </Paper>
  );
}

function Header() {
  // const classes = useHeaderStyles();
  const isNativeApp = useIsNativeApp();
  if (isNativeApp) {
    return <AppHeader />;
  }

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        padding={{ xs: '0.5rem', md: '1rem 0' }}
        spacing={{ xs: 1, md: 2 }}
        sx={{
          position: 'relative',
          zIndex: 100,
          width: '100%',
          left: 0,
          backgroundColor: 'background.paper',
          overflowX: 'auto',
          overflowY: 'hidden',
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: {
              xs: undefined,
              sm: 'hidden',
            },
          }}
        >
          <Navigation />
        </Stack>
        <Layout>
          <AuthenticationStatus />
        </Layout>
      </Stack>
    </Container>
  );
}

export default Header;
