import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useArticleQuery, useMeHeaderQuery } from '../generated/graphql';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Article from '../components/News/article';
import { useParams } from 'react-router-dom';

type urlParams = {
  id: string
}


export default function ArticlePage() {

  const useStyles = makeStyles({
    container: {
      width: "80%",
      margin: "auto",
    },
  })

  const { id } = useParams<urlParams>();

  const classes = useStyles();
  const [keycloak, initialized] = useKeycloak();

  const { loading, data } = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const article = data?.article;

  if (loading) {
    return (
      <p>Laddar artikel...</p>
    )
  }

  return (
    <article className={classes.container}>
      {keycloak.authenticated &&
        <Data />}
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="flex-start"
      >

        <Grid item xs={12} sm={12} md={12} lg={12}>
          {article ?
            <Article
              title={article.header}
              publish_date={article.published_datetime}
              image_url={undefined}
              author={`${article.author.first_name} ${article.author.last_name}`}
              id={article.id.toString()}
              full_article={true} >
              {article.body}
            </Article> : ""}

        </Grid>

      </Grid>

    </article>
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
          <img src={`http://localhost:4000${data.me.picture_path}`} alt="profilbild" />
        </div>
      ) : (
          <p>Misslyckades med att hämnta den inloggade</p>
        ))}
    </div>
  )
}