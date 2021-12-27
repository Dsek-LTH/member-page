import { Grid } from '@mui/material';
import React from 'react';

export default function MandateSkeleton() {
  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
      <Grid item xs={12} />
    </Grid>
  );
}
