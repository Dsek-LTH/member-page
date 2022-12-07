import Box from '@mui/material/Box';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import { Stack } from '@mui/material';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import pageStyles from '~/styles/pageStyles';

export default function Layout({ children }: PropsWithChildren<{}>) {
  const classes = pageStyles();

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
        <Box className={classes.container} sx={{ width: { xs: '90%', md: '95%' } }}>
          <Header />
          <Stack component="main" marginTop="4rem">
            {children}
          </Stack>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
