import Box from '@mui/material/Box';
import Head from 'next/head';
import React from 'react';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { pageStyles } from '../styles/pageStyles';
import { Grid, useTheme } from '@mui/material';
import NavigationList from '../components/Navigation/NavigationList';

export default function Layout({ children }) {
  const classes = pageStyles();
  const theme = useTheme();

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
        <Header />
        <Box className={classes.container}>
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
                a: {
                  color: theme.palette.primary.main,
                },
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
