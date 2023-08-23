import { Stack } from '@mui/material';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import SettingsPage from '../settings';
import LanguageSelector from '~/components/Header/components/LanguageSelector';
import DarkModeSelector from '~/components/Header/components/DarkModeSelector';

function Settings() {
  return (
    <>
      <Stack spacing={1} direction="row">
        <LanguageSelector />
        <DarkModeSelector />
      </Stack>
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
