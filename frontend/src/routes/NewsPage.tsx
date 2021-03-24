import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useMeHeaderQuery, useNewsPageInfoQuery } from '../generated/graphql';
import ArticleSet from '../components/News'
import { Button, Grid, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Calender from '../components/Calender';
import { useHistory, useLocation } from 'react-router-dom';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const articles_per_page = 10

export default function NewsPage() {

  const useStyles = makeStyles({
    container: {
      width: "80%",
      margin: "auto",
    },
  })
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [page_index, set_page_index] = useState(0);
  const [keycloak, initialized] = useKeycloak();

  const { data } = useNewsPageInfoQuery({
    variables: { page_number: page_index, per_page: articles_per_page }
  });
  const totalPages = data?.news?.pageInfo.totalPages ? data.news.pageInfo.totalPages : 1

  useEffect(
    () => {
      const page_number_parameter = new URLSearchParams(location.search).get('page')
      const parsed_page_number = parseInt(page_number_parameter ? page_number_parameter : "")
      const page_number = parsed_page_number ? parsed_page_number : 1
      set_page_index(page_number - 1)
    },
    [location]
  )

  const goBack = () => {
    history.push("/nyheter?page=" + (page_index))
    set_page_index((old_page_index) => old_page_index - 1)
  }

  const goForward = () => {
    history.push("/nyheter?page=" + (page_index + 2))
    set_page_index((old_page_index) => old_page_index + 1)
  }

  return (
    <div className={classes.container}>
      {keycloak.authenticated &&
        <Data />}
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="flex-start"
      >

        <Grid item xs={12} sm={12} md={12} lg={2}>
          <h2>Sidebar</h2>
          <Calender />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <h2>Nyheter</h2>
          <ArticleSet full_articles={true} articles_per_page={articles_per_page} page_index={page_index} />
          <MobileStepper
            steps={totalPages ? totalPages : 0}
            position="static"
            variant="text"
            activeStep={page_index}
            nextButton={
              <Button size="small" onClick={goForward} disabled={(page_index + 1) === totalPages}>
                Nästa
            <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={goBack} disabled={page_index === 0}>
                <KeyboardArrowLeft />
            Tillbaka
          </Button>
            }
          />
        </Grid>
      </Grid>
    </div>
  )
}

function Data() {
  const { loading, data } = useMeHeaderQuery();
  return (
    <div>
      <h1>Inloggad som</h1>
      { loading ? (
        <p>loading...</p>
      ) : (data?.me ? (
        <div>
          <p>Namn: {data.me.first_name} {data.me.last_name}</p>
          <p>Stil-ID: {data.me.student_id}</p>
          <img src={`http://localhost:4000${data.me.picture_path}`} alt="profilbild"  />
        </div>
      ) : (
          <p>Misslyckades med att hämnta den inloggade</p>
        ))}
    </div>
  )
}