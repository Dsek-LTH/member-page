import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  AppBar,
  Box,
  Breakpoint,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Theme,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Image from 'next/image';
import Link from '~/components/Link';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import styles from './styles.module.css';
import useNollaTranslate from './useNollaTranslate';

const Logo = styled('img')`
  height: 2rem;
  margin-right: 1rem;
`;

function Home() {
  return (
    <Link href="/" aria-label="Go to homepage">
      <IconButton>
        <MeetingRoomIcon />
      </IconButton>
    </Link>
  );
}

export const useNavItems = () => {
  const translate = useNollaTranslate();

  return [
    { title: translate('nav.home'), route: routes.nolla.home },
    {
      title: translate('nav.nollningen.title'),
      desc: translate('nav.nollningen.desc'),
      route: routes.nolla.nollningen,
    },
    { title: translate('nav.schedule'), route: routes.nolla.schedule },
    { title: translate('nav.news'), route: routes.nolla.news },
    { title: translate('nav.map'), route: routes.nolla.map },
    { title: translate('nav.guild'), route: routes.nolla.guild },
    {
      title: translate('nav.studenthealth'),
      route: routes.nolla.studenthealth,
    },
    { title: translate('nav.faq'), route: routes.nolla.faq },
    // { title: translate('nav.packinglist'), route: routes.nolla.packinglist },
    // {
    //   title: translate('nav.registration.title'),
    //   desc: translate('nav.registration.desc'),
    //   route: routes.nolla.registration,
    // },
    // { title: translate('nav.accomodation'), route: routes.nolla.accomodation },
    { title: translate('nav.staben'), route: routes.nolla.staben },
    { title: translate('nav.pepparna'), route: routes.nolla.pepparna },
    // { title: translate('nav.checklist'), route: routes.nolla.checklist },
  ];
};

type Props = {
  maxWidth?: Breakpoint | false;
};
function NollaLayout({
  children,
  maxWidth = 'md',
}: React.PropsWithChildren<Props>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const apiContext = useApiAccess();
  const navItems = useNavItems();
  const translate = useNollaTranslate();
  const isMobile = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));

  // restrict access to nolla pages
  useEffect(() => {
    if (!apiContext.apisLoading && !hasAccess(apiContext, 'nolla')) {
      router.push(routes.root);
    }
  }, [apiContext, router]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <List
      sx={{
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        mx: 2,
      }}
    >
      {navItems.map((item) => (
        <ListItem key={item.route} onClick={handleDrawerToggle} disablePadding>
          <ListItemButton onClick={() => router.push(item.route)}>
            <ListItemText
              primary={(
                <Typography fontWeight={900} fontSize={20}>
                  {item.title.toLocaleUpperCase()}
                </Typography>
              )}
            />
          </ListItemButton>
        </ListItem>
      ))}

      <ListItem sx={{ position: 'relative', flexGrow: 1 }}>
        <Image
          src="/images/nolla/nollning_logo_small.png"
          layout="fill"
          alt="nollning logo"
          objectFit="contain"
          objectPosition="top"
        />
      </ListItem>
    </List>
  );

  return (
    <Box
      className={styles.nolla}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& ::selection': {
          background: 'hsl(317, 82%, 56%)',
          color: 'white',
        },
        height: '100vh',
      }}
    >
      <AppBar
        position="relative"
        sx={(t) => ({
          flex: 0,
          backgroundColor:
            t.palette.mode === 'dark'
              ? 'rgba(0, 0, 0)'
              : 'rgba(255, 255, 255, 0.5)',
        })}
      >
        <Toolbar
          sx={{
            gap: 3,
            justifyContent: { xs: 'space-between', sm: 'center' },
            zIndex: 1,
          }}
        >
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.route}
                onClick={() => router.push(item.route)}
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <IconButton onClick={() => router.push(routes.nolla.settings)}>
              <SettingsIcon />
            </IconButton>
            <Home />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              backgroundImage: 'none',
              boxSizing: 'border-box',
              width: 230,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        id="main-container"
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={(t) => ({
          position: 'relative',
          backgroundColor:
            t.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.5)'
              : 'rgba(255, 255, 255, 0.75)',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/images/nolla/background_${
              isMobile ? 'mobile' : 'desktop'
            }.jpg)`,
            backgroundSize: isMobile ? 'cover' : '100%',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat repeat',
            zIndex: -1,
          },
        })}
        >
          <Container maxWidth={maxWidth} sx={{ my: 5, flexGrow: 1, zIndex: 1 }}>
            {children}
          </Container>
        </Box>

        <Paper component="footer" sx={{ py: 3, borderRadius: 0, zIndex: 1 }}>
          <Container
            maxWidth="md"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              rowGap: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Logo src="/images/nolla/d_logo_new.png" alt="D-sek logo" />
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {translate('footer')}
            </Typography>

            <Stack spacing={1} direction="row">
              <Link href="https://instagram.com/dseklth/" newTab>
                <IconButton>
                  <InstagramIcon />
                </IconButton>
              </Link>
              <Link href="https://facebook.com/Dsektionen/" newTab>
                <IconButton>
                  <FacebookIcon />
                </IconButton>
              </Link>
              <Link
                href="https://youtube.com/channel/UCqBtN7xlh4_VvywKaRiGfkw/"
                newTab
              >
                <IconButton>
                  <YouTubeIcon />
                </IconButton>
              </Link>
              <Link href="https://github.com/Dsek-LTH/" newTab>
                <IconButton>
                  <GitHubIcon />
                </IconButton>
              </Link>
              <Link
                href="https://linkedin.com/company/datatekniksektionen-vid-tlth/"
                newTab
              >
                <IconButton>
                  <LinkedInIcon />
                </IconButton>
              </Link>
            </Stack>
          </Container>
        </Paper>
      </Box>
    </Box>
  );
}

export default NollaLayout;
