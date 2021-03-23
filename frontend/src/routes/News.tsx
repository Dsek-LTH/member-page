import React from 'react';

import { useKeycloak } from '@react-keycloak/web';
import { useMeHeaderQuery } from '../generated/graphql';
import NewsPage from '../components/News'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    width: "80%",
    margin: "auto"
  },
});


export function News() {
  const classes = useStyles();
  const [keycloak, initialized] = useKeycloak();
  return (
    <div className={classes.container}>
      {keycloak.authenticated &&
        <Data />}
      <Grid
        container
        spacing={5}
        direction="row"
        justify="center"
        alignItems="flex-start"
      >
        <Grid item md={12} lg={2}>
          
        </Grid>
        <Grid item md={12} lg={6}>
          <NewsPage />
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

export default News;