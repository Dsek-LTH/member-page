import { Box, Paper } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoTitleLayout from '~/components/NoTitleLayout';
import NotificationSettings from '~/components/Settings/NotificationSettings';

export default function SettingsPage() {
  return (
    <NoTitleLayout>
      <Box>
        <Paper sx={{ marginTop: 4, display: 'inline-block', width: 'auto' }}>
          <NotificationSettings />
        </Paper>

      </Box>
    </NoTitleLayout>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
