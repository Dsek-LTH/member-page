import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import articleStyles from './articleStyles';

export default function ArticleSkeleton() {
  const classes = articleStyles();

  return (
    <Paper className={classes.article}>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
        style={{ position: 'relative' }}
      >
        <Grid item xs={12} md={12} lg={7} style={{ minHeight: '140px' }}>
          <Typography variant="h3">
            <Skeleton />
          </Typography>
          <Skeleton />
          <Skeleton />
        </Grid>

        <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>
          <Skeleton
            variant="rectangular"
            className={classes.image}
            width={200}
            height={200}
          />
        </Grid>

        <Stack
          width="100%"
          justifyContent="start"
        >
          <br />
          <br />
          <Typography variant="body1">
            <Skeleton width={200} />
          </Typography>
          <Typography variant="body1">
            <Skeleton width={200} />
          </Typography>
        </Stack>
      </Grid>
    </Paper>
  );
}
