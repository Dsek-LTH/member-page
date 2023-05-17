import { ApolloError } from '@apollo/client';
import
{
  Button,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { getFullName } from '~/functions/memberFunctions';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import UserAvatar from '../UserAvatar';

function Unauthenticated() {
  const { status } = useSession();
  const { t } = useTranslation('common');
  return (
    <Stack direction="row" justifyContent="flex-end" marginLeft="0 !important" minWidth={{ xs: '13.3rem', md: '13.3rem' }}>
      <Button
        style={{
          minWidth: '5.25rem',
          visibility: status === 'unauthenticated' ? 'visible' : 'hidden',
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
          visibility: status === 'unauthenticated' ? 'visible' : 'hidden',
        }}
        onClick={() => signIn('keycloak')}
      >
        {t('sign in')}
      </Button>
    </Stack>
  );
}

function Failure({ error }: { error: ApolloError }) {
  const { t } = useTranslation('common');
  if (error.message === 'Member not found') {
    return null;
  }
  return <Typography>{t('failed')}</Typography>;
}

function Loading() {
  const theme = useTheme();
  return <CircularProgress color="inherit" size={theme.spacing(4)} />;
}

function Account() {
  const { user } = useUser();
  const { t } = useTranslation('common');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        id="account-button"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <UserAvatar src={user?.picture_path} size={4} />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        PaperProps={{
          sx: {
            width: { xs: '90%', md: '354px' },
            textAlign: 'center',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        elevation={1}
      >
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
          <Stack direction="row" justifyContent="center" gap={2}>
            <Link href={routes.member(user.student_id)} passHref>
              <Button variant="outlined">{t('show profile')}</Button>
            </Link>
            <Link href={routes.settings} passHref>
              <Button variant="outlined">{t('settings')}</Button>
            </Link>
          </Stack>
        </CardContent>
        <Divider />
        <CardContent>
          <Button
            onClick={() => signOut()}
            variant="outlined"
          >
            {t('sign out')}
          </Button>
        </CardContent>
      </Menu>
    </>
  );
}

function AuthenticationStatus() {
  const { status } = useSession();
  const { user, error } = useUser();

  if (status === 'unauthenticated' && !user) {
    return <Unauthenticated />;
  }

  if (error) {
    return <Failure error={error} />;
  }

  if (!user) {
    return <Loading />;
  }

  return <Account />;
}

export default AuthenticationStatus;
