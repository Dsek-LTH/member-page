import { Paper } from '@mui/material';
import DarkModeSelector from '~/components/Header/components/DarkModeSelector';
import LanguageSelector from '~/components/Header/components/LanguageSelector';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import SettingsPage from '../settings';

function Settings() {
  return (
    <>
      <Paper sx={{
        p: 2, alignSelf: 'flex-start', display: 'inline-flex', flexDirection: 'row', gap: 1,
      }}
      >
        <LanguageSelector />
        <DarkModeSelector />
      </Paper>
      <SettingsPage />
    </>
  );
}

Settings.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export const getStaticProps = genGetProps(['nolla', 'news']);

Settings.theme = theme;

export default Settings;
