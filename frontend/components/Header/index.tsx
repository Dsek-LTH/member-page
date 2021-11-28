import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Link from 'next/link';
import DsekIcon from '../Icons/DsekIcon';
import UserAvatar from '../UserAvatar';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import { getFullName } from '~/functions/memberFunctions';
import { createStyles, makeStyles } from '@mui/styles';
import { isServer } from '~/functions/isServer';
import DarkModeSelector from './components/DarkModeSelector';
import LanguageSelector from './components/LanguageSelector';

const useHeaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
    },
  })
);

function Header() {
  const classes = useHeaderStyles();

  return (
    <Box className={classes.box}>
      <Link href={routes.root}>
        <IconButton>
          <DsekIcon color="primary" style={{ fontSize: 48 }} />
        </IconButton>
      </Link>
      <Account />
    </Box>
  );
}

const useAccountStyles = makeStyles((theme: Theme) =>
  createStyles({
    userCard: {
      position: 'absolute',
      top: '72px',
      margin: '0 auto',
      textAlign: 'center',
      width: '90%',
      [theme.breakpoints.up('sm')]: {
        width: '354px',
        margin: 0,
        right: theme.spacing(4),
      },
    },
    backdrop: {
      zIndex: 2000,
      [theme.breakpoints.up('sm')]: {
        backgroundColor: 'transparent',
      },
    },
    avatar: {
      marginLeft: '0.5rem',
    },
  })
);

const Layout = ({ children }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <LanguageSelector />
    <DarkModeSelector />
    <div>{children}</div>
  </Stack>
);

function Account() {
  const classes = useAccountStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading } = useContext(UserContext);
  const { t } = useTranslation('common');

  if (!keycloak?.authenticated)
    return (
      <Layout>
        <Button
          style={{
            minWidth: '5.25rem',
            visibility: initialized && !isServer ? 'visible' : 'hidden',
          }}
          onClick={() => keycloak.login()}
        >
          {t('sign in')}
        </Button>
      </Layout>
    );
  if (loading || !initialized)
    return (
      <Layout>
        <CircularProgress color="inherit" size={theme.spacing(4)} />
      </Layout>
    );
  if (!user)
    return (
      <Layout>
        <Typography>{t('failed')}</Typography>
      </Layout>
    );
  return (
    <Layout>
      <ButtonBase
        className={classes.avatar}
        disableRipple
        onClick={() => setOpen(true)}
      >
        <UserAvatar src="" size={4} />
      </ButtonBase>
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={() => setOpen(false)}
      >
        <Card className={classes.userCard}>
          <CardContent>
            <Typography variant="overline"> {t('logged in as')} </Typography>
            <Typography variant="h6"> {getFullName(user)} </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {user.student_id}
            </Typography>
            <UserAvatar centered src="" size={8} />
          </CardContent>
          <CardContent>
            <Link href={routes.member(user.id)}>
              <Button variant="outlined">{t('show profile')}</Button>
            </Link>
          </CardContent>
          <Divider />
          <CardContent>
            <Button onClick={() => keycloak.logout()} variant="outlined">
              {t('sign out')}
            </Button>
          </CardContent>
        </Card>
      </Backdrop>
    </Layout>
  );
}

export default Header;
