import
{
  Box, Button, CircularProgress, Paper, Stack, Typography, useTheme,
} from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import DarkModeSelector from '~/components/Header/components/DarkModeSelector';
import LanguageSelector from '~/components/Header/components/LanguageSelector';
import MyCart from '~/components/Header/components/MyCart';
import MyChest from '~/components/Header/components/MyChest';
import NotificationsBell from '~/components/Header/components/NotificationsBell';
import UserAvatar from '~/components/UserAvatar';
import genGetProps from '~/functions/genGetServerSideProps';
import { getFullName } from '~/functions/memberFunctions';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

function Unauthenticated() {
  // const { status } = useSession();
  const status = 'unauthenticated';
  const { t } = useTranslation('common');
  return (
    <Box sx={{
      display: 'flex',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <Paper sx={{
        p: 4,
      }}
      >
        <Stack gap={4}>
          <Button
            style={{
              fontSize: '1.25em',
              visibility: status === 'unauthenticated' ? 'visible' : 'hidden',
            }}
            onClick={() => signIn('keycloak')}
          >
            {t('sign in')}
          </Button>

        </Stack>

      </Paper>

    </Box>
  );
}

function Loading() {
  const theme = useTheme();
  return (
    <Box sx={{
      display: 'flex',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <CircularProgress size={theme.spacing(8)} />
    </Box>
  );
}
function Failure() {
  const { t } = useTranslation('common');
  return (
    <Box sx={{
      display: 'flex',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <Typography variant="h4">{t('failed')}</Typography>
    </Box>
  );
}

function AccountScreen() {
  const { user } = useUser();
  const { t } = useTranslation('common');

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="overline">
        {` ${t('logged in as')} `}
      </Typography>
      <Typography variant="h6">
        {getFullName(user)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {user.student_id}
      </Typography>
      <UserAvatar centered src={user?.picture_path} size={32} />
      <Stack gap={2} sx={{ mt: 4 }}>
        <Stack direction="row" gap={2} alignItems="center" justifyContent="space-around">
          <MyCart />
          <MyChest />
          <LanguageSelector />
          <DarkModeSelector />
          <NotificationsBell />
        </Stack>
        <Link href={routes.member(user.student_id)} passHref>
          <Button variant="outlined">{t('show profile')}</Button>
        </Link>
        <Link href={routes.settings} passHref>
          <Button variant="outlined">{t('settings')}</Button>
        </Link>
        <Button
          onClick={() => signOut()}
          variant="outlined"
        >
          {t('sign out')}
        </Button>
      </Stack>
    </Paper>
  );
}

function Account() {
  const { status } = useSession();
  const { user, error } = useUser();

  if (status === 'unauthenticated' && !user) {
    return <Unauthenticated />;
  }

  if (error) {
    return <Failure />;
  }

  if (!user) {
    return <Loading />;
  }

  return <AccountScreen />;
}

export const getStaticProps = genGetProps();
export default Account;
