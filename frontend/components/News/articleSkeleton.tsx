import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import articleStyles from './articleStyles';

export default function ArticleSkeleton({ fullArticle }: { fullArticle?: boolean }) {
  const classes = articleStyles();

  return (
    <Paper className={classes.article}>
      <Stack
        direction="row"
        alignItems="flex-start"
        style={{ position: 'relative' }}
      >
        <Grid item xs={12} md={12} lg={7} style={{ minHeight: fullArticle ? '500px' : '200px' }}>
          <Typography variant="h3">
            <Skeleton />
          </Typography>
          <Skeleton />
          <Skeleton />
        </Grid>

      </Stack>
    </Paper>
  );
}
