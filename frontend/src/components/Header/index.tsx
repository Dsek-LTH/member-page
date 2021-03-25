import React, { useState } from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';

import { useKeycloak } from '@react-keycloak/web';

import { useMeHeaderQuery } from '../../generated/graphql';
import DsekIcon from '../DsekIcon';
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
      <IconButton edge='start' aria-label='menu'>
        <MenuIcon/>
      </IconButton>
      <IconButton>
        <DsekIcon color='primary' style={{ fontSize: 48 }}/>
      </IconButton>
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

  const { keycloak } = useKeycloak();
  const { loading, data } = useMeHeaderQuery();

  if (!keycloak) return <div></div>
  if (!keycloak.authenticated) return <Button onClick={() => keycloak.login()}>Logga in</Button>
  if (loading) return <CircularProgress color='inherit' size={theme.spacing(4)}/>
  if (!data?.me) return <Typography>Misslyckades</Typography>

  const name = `${data.me.first_name} ${data.me.last_name}`;
  return (
    <div>
      <ButtonBase className={classes.avatar} disableRipple onClick={() => setOpen(true)}>
        <UserAvatar src='' size={4}/>
      </ButtonBase>
      <Backdrop className={classes.backdrop} open={open} onClick={() => setOpen(false)}>
        <Card className={classes.userCard}>
          <CardContent>
            <Typography variant='overline'> Inloggad som </Typography>
            <Typography variant='h6'> {name} </Typography>
            <Typography variant='subtitle1' gutterBottom>{data.me.student_id}</Typography>
            <UserAvatar src='' size={8}/>
          </CardContent>
          <CardContent>
            <Button variant='outlined'>Visa profil</Button>
          </CardContent>
          <Divider/>
          <CardContent>
            <Button onClick={() => keycloak.logout()} variant='outlined'>Logga ut</Button>
          </CardContent>
        </Card>
      </Backdrop>
    </div>
  )
}

export default Header;