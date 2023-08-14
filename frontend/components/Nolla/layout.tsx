import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  AppBar,
  Box,
  Breakpoint,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LanguageSelector from '~/components/Header/components/LanguageSelector';
import Link from '~/components/Link';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import styles from './styles.module.css';
import useNollaTranslate from './useNollaTranslate';
import DarkModeSelector from '../Header/components/DarkModeSelector';

const Logo = styled('img')`
  height: 2rem;
  margin-right: 1rem;
`;

function Home() {
  return (
    <Link href="/" aria-label="Go to homepage">
      <IconButton>
        <HomeIcon />
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
    {
      title: translate('nav.registration.title'),
      desc: translate('nav.registration.desc'),
      route: routes.nolla.registration,
    },
    { title: translate('nav.accomodation'), route: routes.nolla.accomodation },
    { title: translate('nav.guild'), route: routes.nolla.guild },
    { title: translate('nav.packinglist'), route: routes.nolla.packinglist },
    { title: translate('nav.checklist'), route: routes.nolla.checklist },
    { title: translate('nav.pepparna'), route: routes.nolla.pepparna },
    {
      title: translate('nav.studenthealth'),
      route: routes.nolla.studenthealth,
    },
    { title: translate('nav.faq'), route: routes.nolla.faq },
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
    <Box>
      <Toolbar sx={{ justifyContent: 'space-around' }}>
        <Typography variant="h6">D‑SEK</Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.route}
            disablePadding
            onClick={handleDrawerToggle}
          >
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => router.push(item.route)}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem
          disablePadding
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <LanguageSelector />
          <DarkModeSelector />
          <Home />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="span"
      className={styles.nolla}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& ::selection': {
          background: 'hsl(317, 82%, 56%)',
          color: 'white',
        },
        minHeight: '100vh',
      }}
    >
      <AppBar
        sx={{
          position: 'sticky',
          background: 'linear-gradient(90deg, #AA28A7 0%, #DC2A8A 100%)',
        }}
      >
        <Toolbar sx={{ gap: 3, justifyContent: { xs: 'left', sm: 'center' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
                sx={{ color: '#fff' }}
                onClick={() => router.push(item.route)}
              >
                {item.title}
              </Button>
            ))}
            <LanguageSelector />
            <DarkModeSelector />
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
              boxSizing: 'border-box',
              width: 230,
              background: 'linear-gradient(0deg, #DC2A8A 0%, #AA28A7 100%)',
              color: 'white',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Container maxWidth={maxWidth} sx={{ my: 5, flexGrow: 1 }}>
        {children}
      </Container>

      <Paper component="footer" sx={{ py: 3, borderRadius: 0 }}>
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
            Frågor om nollningen? Kontakta
            {' '}
            <a href="mailto:staben2023@gmail.com">staben2023@gmail.com</a>
            .
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
  );
}

export default NollaLayout;
