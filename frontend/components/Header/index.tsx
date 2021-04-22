import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Link from 'next/link';
import { useMeHeaderQuery } from '../../generated/graphql';
import DsekIcon from '../Icons/DsekIcon';
import UserAvatar from '../UserAvatar';

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
    }
  })
)

function Header() {
  const classes = useHeaderStyles();

  return (
    <Box className={classes.box}>
      <Link href={'/'}>
        <IconButton>
          <DsekIcon color='primary' style={{ fontSize: 48 }}/>
        </IconButton>
      </Link>
      <Account/>
    </Box>
  )
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
      margin: theme.spacing(1),
    }
  })
)

function Account() {
  const classes = useAccountStyles();
  const theme = useTheme();

  const [ open, setOpen ] = useState(false);

  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useMeHeaderQuery();
  const { t } = useTranslation('common');

  if (!keycloak) return <div></div>
  if (!keycloak?.authenticated) return <Button onClick={() => keycloak.login()}>{t('sign in')}</Button>
  if (loading || !initialized) return <CircularProgress color='inherit' size={theme.spacing(4)}/>
  if (!data?.me) return <Typography>{t('failed')}</Typography>

  const name = `${data.me.first_name} ${data.me.last_name}`;
  return (
    <div>
      <ButtonBase className={classes.avatar} disableRipple onClick={() => setOpen(true)}>
        <UserAvatar src='' size={4}/>
      </ButtonBase>
      <Backdrop className={classes.backdrop} open={open} onClick={() => setOpen(false)}>
        <Card className={classes.userCard}>
          <CardContent>
            <Typography variant='overline'> {t('logged in as')} </Typography>
            <Typography variant='h6'> {name} </Typography>
            <Typography variant='subtitle1' gutterBottom>{data.me.student_id}</Typography>
            <UserAvatar centered src='' size={8}/>
          </CardContent>
          <CardContent>
            <Link href={'/members/' + data.me.id}>
              <Button variant='outlined'>{t('show profile')}</Button>
            </Link>
          </CardContent>
          <Divider/>
          <CardContent>
            <Button onClick={() => keycloak.logout()} variant='outlined'>{t('sign out')}</Button>
          </CardContent>
        </Card>
      </Backdrop>
    </div>
  )
}

export default Header;