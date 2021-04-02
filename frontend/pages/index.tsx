import React from 'react';
import ArticleSet from '../components/News/articleSet'
import { Grid } from '@material-ui/core';
import Calender from '../components/Calender';
import { homePageStyles } from '../styles/homePageStyles'

export default function HomePage() {
  const classes = homePageStyles();

  return (
    <div className={classes.container}>
      <Grid
        container
        spacing={3}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >

        <Grid item xs={12} sm={12} md={12} lg={2}>
          <h2>Sidebar</h2>
          <Calender />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <h2>Nyheter</h2>
          <ArticleSet fullArticles={false} articlesPerPage={10} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <h2>Kalender</h2>
          <Calender />
        </Grid>
      </Grid>

    </div>
  )
}