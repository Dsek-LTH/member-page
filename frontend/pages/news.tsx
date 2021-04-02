import React, { useEffect, useState } from 'react';
import { useNewsPageInfoQuery } from '../generated/graphql';
import ArticleSet from '../components/News/articleSet'
import NewsStepper from '../components/News/newsStepper'
import { Grid } from '@material-ui/core';
import Calender from '../components/Calender';
import { newsPageStyles } from '../styles/newsPageStyles';
import { useRouter } from 'next/router'

const articlesPerPage = 10

export default function NewsPage() {
  const classes = newsPageStyles();
  const router = useRouter();

  const [pageIndex, setPageIndex] = useState(0);

  const { loading, data } = useNewsPageInfoQuery({
    variables: { page_number: pageIndex, per_page: articlesPerPage }
  });

  useEffect(
    () => {
      const pageNumberParameter = new URLSearchParams(router.asPath).get('page')
      const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter) : 0
      setPageIndex(pageNumber)
    },
    [router.pathname]
  )

  if (loading)
    return (<p></p>)

  if (!data?.news)
    return (<p></p>)

 const totalPages = data.news.pageInfo.totalPages || 1;

  const goBack = () => {
    router.push("/news?page=" + (pageIndex - 1))
    setPageIndex((oldPageIndex) => oldPageIndex - 1)
  }

  const goForward = () => {
    router.push("/news?page=" + (pageIndex + 1))
    setPageIndex((oldPageIndex) => oldPageIndex + 1)
  }

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
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <h2>Nyheter</h2>
          <ArticleSet fullArticles={true} articlesPerPage={articlesPerPage} pageIndex={pageIndex} />
          <NewsStepper pages={totalPages} index={pageIndex} onForwardClick={goForward} onbackwardClick={goBack} />
        </Grid>
      </Grid>
    </div>
  )
}