import Box from '@mui/material/Box';
import Head from 'next/head';
import React from 'react';
import Header from '../components/Header';
import Grid from '@mui/material/Grid';
import NavigationList from '../components/Navigation/NavigationList';
import { commonPageStyles } from '../styles/commonPageStyles';

export default function MemberLayout({ children }) {
  const classes = commonPageStyles();

  return (
    <>
      <Head>
        <title>D-sektionen</title>
      </Head>

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
            md={12}
            lg={2}
            className={classes.sidebarGrid}
          >
            <NavigationList />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={10}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
