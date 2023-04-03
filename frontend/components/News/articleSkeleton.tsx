import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import articleStyles from './articleStyles';

export function SmallArticleSkeleton() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="stretch"
        style={{ position: 'relative' }}
        gap={1}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <Stack sx={{ flex: 1 }} justifyContent="space-between">
          <Skeleton height={20} />
          <Skeleton />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function ArticleSkeleton({ fullArticle }: { fullArticle?: boolean }) {
  const classes = articleStyles();

  return (
    <Paper className={classes.article}>
      <Grid
        container
      >
        <Grid item xs={12} md={12} lg={7} style={{ minHeight: fullArticle ? '500px' : '200px' }}>
          <Typography variant="h3">
            <Skeleton />
          </Typography>
          <Skeleton />
          <Skeleton />
        </Grid>

      </Grid>
    </Paper>
  );
}
