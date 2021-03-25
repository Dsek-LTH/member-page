import React from 'react';
import { useArticleQuery } from '../../generated/graphql';
import { Grid } from '@material-ui/core';
import Article from '../../components/News/article';
import { useParams } from 'react-router-dom';
import { articlePageStyles } from './articlePagestyles'

type urlParams = {
  id: string
}

export default function ArticlePage() {
  const { id } = useParams<urlParams>();
  const classes = articlePageStyles();

  const { loading, data } = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const article = data?.article;

  if (loading) {
    return (
      <p>Laddar artikel...</p>
    )
  }

  if (!article) {
    return (
      <p></p>
    )
  }

  return (
    <article className={classes.container}>
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="flex-start"
      >

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Article
            title={article.header}
            publishDate={article.published_datetime}
            imageUrl={undefined}
            author={`${article.author.first_name} ${article.author.last_name}`}
            id={article.id.toString()}
            fullArticle={true} >
            {article.body}
          </Article>
        </Grid>
      </Grid>
    </article>
  )
}