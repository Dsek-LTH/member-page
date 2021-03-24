import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useMeHeaderQuery } from '../generated/graphql';
import NewsPage from '../components/News'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Calender from '../components/Calender';

export default function HomePage() {

  const useStyles = makeStyles({
    container: {
      width: "80%",
      margin: "auto",
    },
  })

  const classes = useStyles();
  const [keycloak, initialized] = useKeycloak();
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
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <h2>Nyheter</h2>
          <NewsPage full_articles={false} articles_per_page={10} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <h2>Kalender</h2>
          <Calender />
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