import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
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
    avatar: {
      minWidth: '5.25rem',
      marginLeft: '0.5rem',
    },
  }));

function Unauthenticated() {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('common');
  return (
    <Button
      style={{
        minWidth: '5.25rem',
        visibility: initialized && !isServer ? 'visible' : 'hidden',
      }}
      onClick={() => keycloak.login()}
    >
      {t('sign in')}
    </Button>
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
            <Typography variant="overline">
              {` ${t('logged in as')} `}
            </Typography>
            <Typography variant="h6">
              {getFullName(user)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {user.student_id}
            </Typography>
            <UserAvatar centered src="" size={8} />
          </CardContent>
          <CardContent>
            <Link href={routes.member(user.id)} passHref>
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
    </>
  );
}

function AuthenticationStatus() {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { user, error } = useUser();

  if (!keycloak?.authenticated) {
    return <Unauthenticated />;
  }

  if (error) {
    return <Failure />;
  }

  if (!user || !initialized) {
    return <Loading />;
  }

  return <Account />;
}

export default AuthenticationStatus;
