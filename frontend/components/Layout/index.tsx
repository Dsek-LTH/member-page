import { Alert, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren } from 'react';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import BottomTabBar from '~/components/Layout/BottomTabBar';
import Markdown from '~/components/Markdown';
import selectTranslation from '~/functions/selectTranslation';
import { useAlertsQuery } from '~/generated/graphql';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import pageStyles from '~/styles/pageStyles';

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { i18n } = useTranslation();
  const classes = pageStyles();
  const { data } = useAlertsQuery();
  const alerts = data?.alerts ?? [];
  const isNativeApp = useIsNativeApp();

  return (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowX: isNativeApp ? 'hidden' : undefined,
      }}
    >
      <Header />
      <Box sx={{
        overflowY: 'auto', paddingBottom: isNativeApp ? '2rem' : undefined, position: 'relative', flexGrow: 1,
      }}
      >
        <Box className={classes.container} sx={{ width: { xs: '90%', md: '95%' }, py: 1 }}>
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
          <Stack component="main">
            {children}
          </Stack>
        </Box>
        {!isNativeApp && <Footer />}
      </Box>
      {isNativeApp && <BottomTabBar />}
    </Box>
  );
}
