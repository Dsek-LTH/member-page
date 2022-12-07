import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Backdrop,
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
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Link from 'next/link';
import { createStyles, makeStyles } from '@mui/styles';
import UserAvatar from '../UserAvatar';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';
import { getFullName } from '~/functions/memberFunctions';
import isServer from '~/functions/isServer';

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
      zIndex: 10,
      marginLeft: '0 !important',
      [theme.breakpoints.up('sm')]: {
        backgroundColor: 'transparent',
      },
    },
  }));

function Unauthenticated() {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('common');
  return (
    <Stack direction="row" justifyContent="flex-end" marginLeft="0 !important" minWidth={{ xs: '13.3rem', md: '13.3rem' }}>
      <Button
        style={{
          minWidth: '5.25rem',
          visibility: initialized && !isServer ? 'visible' : 'hidden',
          whiteSpace: 'nowrap',
        }}
        href="https://reg.dsek.se"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('register')}
      </Button>
      <Button
        style={{
          minWidth: '5.25rem',
          visibility: initialized && !isServer ? 'visible' : 'hidden',
        }}
        onClick={() => keycloak.login()}
      >
        {t('sign in')}
      </Button>
    </Stack>
  );
}

function Failure() {
  const { t } = useTranslation('common');
  return <Typography>{t('failed')}</Typography>;
}

function Loading() {
  const theme = useTheme();
  return <CircularProgress color="inherit" size={theme.spacing(4)} />;
}

function Account() {
  const classes = useAccountStyles();
  const [open, setOpen] = useState(false);
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const { user } = useUser();
  const { t } = useTranslation('common');

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
      >
        <UserAvatar src={user?.picture_path} size={4} />
      </IconButton>
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={() => setOpen(false)}
      >
        <Card className={classes.userCard}>
          <CardContent>
            <Typography variant="overline">
              {` ${t('logged in as')} `}
            </Typography>
            <Typography variant="h6">
              {getFullName(user)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {user.student_id}
            </Typography>
            <UserAvatar centered src={user?.picture_path} size={8} />
          </CardContent>
          <CardContent>
            <Link href={routes.member(user.student_id)} passHref>
              <Button variant="outlined">{t('show profile')}</Button>
            </Link>
          </CardContent>
          <Divider />
          <CardContent>
            <Button
              onClick={() => {
                keycloak.logout();
              }}
              variant="outlined"
            >
              {t('sign out')}
            </Button>
          </CardContent>
        </Card>
      </Backdrop>
    </>
  );
}

function AuthenticationStatus() {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const { user, error } = useUser();

  if (!keycloak?.authenticated && !user) {
    return <Unauthenticated />;
  }

  if (error) {
    return <Failure />;
  }

  if (!user) {
    return <Loading />;
  }

  return <Account />;
}

export default AuthenticationStatus;
