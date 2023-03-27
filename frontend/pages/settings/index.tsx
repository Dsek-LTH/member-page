import
{
  CircularProgress, Fade, Grid, Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import NoTitleLayout from '~/components/NoTitleLayout';
import NotificationSettings from '~/components/Settings/NotificationSettings';
import SubscriptionSettings from '~/components/Settings/SubscriptionSettings';
import genGetProps from '~/functions/genGetServerSideProps';
import { useUser } from '~/providers/UserProvider';

export default function SettingsPage() {
  const { user, loading } = useUser();
  const { t } = useTranslation();

  if (loading) {
    <NoTitleLayout>
      <CircularProgress />
    </NoTitleLayout>;
  }
  if (!user) {
    return <Fade in style={{ transitionDelay: '200ms' }}><div>{t('notAuthenticated')}</div></Fade>;
  }
  return (
    <NoTitleLayout>
      <Grid container justifyContent="center" columnSpacing={{ xs: 4 }}>
        <Grid item xs={12} md={6} flexShrink={0}>
          <Paper sx={{ marginTop: 4, width: 'auto' }}>
            <NotificationSettings />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} flexShrink={0}>
          <Paper sx={{ marginTop: 4, width: 'auto' }}>
            <SubscriptionSettings />
          </Paper>
        </Grid>
      </Grid>
    </NoTitleLayout>
  );
}

export const getStaticProps = genGetProps(['news']);
