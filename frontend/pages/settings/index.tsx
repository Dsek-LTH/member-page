import { Grid, Paper } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoTitleLayout from '~/components/NoTitleLayout';
import NotificationSettings from '~/components/Settings/NotificationSettings';
import SubscriptionSettings from '~/components/Settings/SubscriptionSettings';

export default function SettingsPage() {
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

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'news'])),
  },
});
