import Box from '@mui/material/Box';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import { Grid, Alert } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import pageStyles from '../styles/pageStyles';
import NavigationList from './Navigation/NavigationList';
import { useAlertsQuery } from '~/generated/graphql';
import selectTranslation from '~/functions/selectTranslation';

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { i18n } = useTranslation();
  const classes = pageStyles();
  const { data } = useAlertsQuery();
  const alerts = data?.alerts || [];
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
        }}
      >
        <Box className={classes.container}>
          <Header />
          {alerts.map((alert) => (
            <Alert severity={alert.severity} key={alert.id}>
              {selectTranslation(i18n, alert.message, alert.messageEn)}
            </Alert>
          ))}
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              className={classes.sidebarGrid}
            >
              <NavigationList className={classes.sidebar} />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
              sx={{
                paddingTop: { xs: '0px !important', md: '24px !important' },
              }}
            >
              {children}
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
