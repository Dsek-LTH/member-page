import Box from '@mui/material/Box';
import React, { PropsWithChildren } from 'react';
import { Stack, Alert } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Markdown from '~/components/Markdown';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { useAlertsQuery } from '~/generated/graphql';
import pageStyles from '~/styles/pageStyles';
import selectTranslation from '~/functions/selectTranslation';

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { i18n } = useTranslation();
  const classes = pageStyles();
  const { data } = useAlertsQuery();
  const alerts = data?.alerts || [];
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Box className={classes.container} sx={{ width: { xs: '90%', md: '95%' } }}>
        <Header />
        <Box sx={{ minHeight: '5rem' }} />
        <Stack>
          {alerts.map((alert) => (
            <Alert severity={alert.severity} key={alert.id} sx={{ alignItems: 'center', margin: { xs: '0.125rem -1rem', md: '0.125rem -2rem' } }}>
              <Markdown content={selectTranslation(i18n, alert.message, alert.messageEn)} />
            </Alert>
          ))}
        </Stack>
        <Stack component="main">
          {children}
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
}
