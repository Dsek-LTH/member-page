import Box from '@material-ui/core/Box';
import Head from 'next/head';
import React from 'react';
import Header from '../components/Header';
import pageStyles from '../styles/pageStyles';
import { Grid } from '@material-ui/core';
import NavigationList from '../components/Navigation/NavigationList';



export default function DefaultLayout({ children }) {
    const classes = pageStyles();

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
                    <Grid item xs={12} sm={12} md={12} lg={2} className={classes.sidebarGrid}>
                        <NavigationList className={classes.sidebar} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={10} >
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
