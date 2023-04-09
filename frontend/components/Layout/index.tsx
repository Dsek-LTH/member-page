import Box from '@mui/material/Box';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import { Stack, Alert, Container } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Markdown from '~/components/Markdown';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { useAlertsQuery } from '~/generated/graphql';
import pageStyles from '~/styles/pageStyles';
import selectTranslation from '~/functions/selectTranslation';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import BottomTabBar from '~/components/Layout/BottomTabBar';

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { i18n } = useTranslation();
  const classes = pageStyles();
  const { data } = useAlertsQuery();
  const alerts = data?.alerts ?? [];
  const isNativeApp = useIsNativeApp();

  return (
    <>
      <Head>
        <title>D-sektionen</title>
      </Head>
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          paddingBottom: isNativeApp ? '6rem' : '0', // for bottom tab bar
        }}
      >
        <Container className={classes.container}>
          {!isNativeApp && (
          <Header />
          ) }
          <Box sx={{ minHeight: isNativeApp ? '2rem' : '5rem' }} />
          <Stack>
            {alerts.map((alert) => (
              <Alert
                severity={alert.severity}
                key={alert.id}
                sx={{
                  alignItems: 'center',
                  margin: isNativeApp ? undefined : { xs: '0.125rem 0rem', md: '0.125rem 0rem' },
                  marginBottom: isNativeApp ? '1rem' : undefined,
                }}
              >
                <Markdown content={selectTranslation(i18n, alert.message, alert.messageEn)} />
              </Alert>
            ))}
          </Stack>
          <Stack component="main">
            {children}
          </Stack>
        </Container>
        {!isNativeApp ? <Footer /> : <BottomTabBar />}
      </Box>
    </>
  );
}
