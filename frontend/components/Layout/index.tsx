import
{
  Alert,
  Container,
  Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren } from 'react';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import BottomTabBar from '~/components/Layout/BottomTabBar';
import Markdown from '~/components/Markdown';
import selectTranslation from '~/functions/selectTranslation';
import { useAlertsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useIsNativeApp } from '~/providers/NativeAppProvider';

export default function Layout({ children, isNolla }: PropsWithChildren<{ isNolla:boolean }>) {
  const { t, i18n } = useTranslation(['common']);
  const { data } = useAlertsQuery();
  const alerts = data?.alerts ?? [];
  const isNativeApp = useIsNativeApp();

  const apiContext = useApiAccess();
  // restrict access to nolla pages
  const isAccessDenied = isNolla && !hasAccess(apiContext, 'nolla');

  return (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowX: isNativeApp ? 'hidden' : undefined,
        overflowY: 'hidden',
      }}
    >
      <Header isNolla={isNolla} />
      <Box
        id="main-container"
        sx={{
          overflowY: 'auto',
          paddingBottom: isNativeApp ? '2rem' : undefined,
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1, py: 1 }}>
          <Container>

            <Stack>
              {alerts.map((alert) => (
                <Alert
                  severity={alert.severity}
                  key={alert.id}
                  sx={{
                    alignItems: 'center',
                    margin: isNativeApp ? undefined : { xs: '0.125rem -1rem', md: '0.125rem -2rem' },
                    marginBottom: isNativeApp ? '0.5rem' : undefined,
                    fontSize: isNativeApp ? '0.8rem' : undefined,
                    '& p': isNativeApp ? {
                      m: 0,
                    } : undefined,
                  }}
                >
                  <Markdown content={selectTranslation(i18n, alert.message, alert.messageEn)} />
                </Alert>
              ))}
            </Stack>
          </Container>
          <Container component="main">
            {isAccessDenied ? t('no_permission_page') : children}
          </Container>
        </Box>
        {!isNativeApp && <Footer />}
      </Box>
      {isNativeApp && <BottomTabBar />}
    </Box>
  );
}
