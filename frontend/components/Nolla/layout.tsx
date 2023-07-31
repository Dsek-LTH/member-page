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
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import LanguageSelector from '~/components/Header/components/LanguageSelector';
import Link from '~/components/Link';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import HomeIcon from '@mui/icons-material/Home';
import styles from './styles.module.css';

export const navItems = [
  { title: 'Hem', route: routes.nolla.home },
  { title: 'Nollningen', desc: 'Vad är nollningen?', route: routes.nolla.nollningen },
  { title: 'Säkra programplats', desc: 'Säkra din plats på programmet', route: routes.nolla.registration },
  { title: 'Boende', route: routes.nolla.accomodation },
  { title: 'Sektionen', route: routes.nolla.guild },
  { title: 'Packning', route: routes.nolla.packinglist },
  { title: 'Checklista', route: routes.nolla.checklist },
  { title: 'Pepparna', route: routes.nolla.pepparna },
  { title: 'Må bra', route: routes.nolla.studenthealth },
  { title: 'FAQ', route: routes.nolla.faq },
];

type Props = {
  maxWidth?: Breakpoint | false;
};
function NollaLayout({ children, maxWidth = 'md' }: React.PropsWithChildren<Props>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const apiContext = useApiAccess();

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
          <ListItem key={item.route} disablePadding onClick={handleDrawerToggle}>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => router.push(item.route)}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* <ListItem disablePadding sx={{ display: 'flex', justifyContent: 'center' }}>
          <LanguageSelector />
        </ListItem> */}
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
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Button key={item.route} sx={{ color: '#fff' }} onClick={() => router.push(item.route)}>
                {item.title}
              </Button>
            ))}
            {/* <LanguageSelector /> */}
            <Link href="/" aria-label="Go to homepage">
              <IconButton>
                <HomeIcon />
              </IconButton>
            </Link>
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
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, height: 40 }}>
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/images/nolla/d_logo_new.png"
                alt="D-sek logo"
                layout="fill"
                objectFit="contain"
                objectPosition="left"
              />
            </Link>
          </Box>

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
