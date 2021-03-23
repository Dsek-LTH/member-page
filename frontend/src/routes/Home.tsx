import React from 'react';

import { useKeycloak } from '@react-keycloak/web';
import { useMeHeaderQuery } from '../generated/graphql';
import NewsPage from '../components/News'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Calender from '../components/Calender';
import { useTheme } from '@material-ui/core/styles'


export function Home() {
  const theme = useTheme()

  const useStyles = makeStyles({
    container: {
      width: "80%",
      margin: "auto",
    },
    headers: {
      [theme.breakpoints.down('xs')]: {
        //fontSize: "1.1em"
      },
    }
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
          <h2 className={classes.headers}>Sidebar</h2>
          <Calender />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <h2 className={classes.headers}>Nyheter</h2>
          <NewsPage />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <h2 className={classes.headers}>Kalender</h2>
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
          <img src={`http://localhost:4000${data.me.picture_path}`} />
        </div>
      ) : (
          <p>Misslyckades med att hämnta den inloggade</p>
        ))}
    </div>
  )
}

export default Home;