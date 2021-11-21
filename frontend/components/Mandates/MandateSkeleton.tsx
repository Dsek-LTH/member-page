import { Grid } from "@mui/material";
import React from "react";
import { mandateStyles } from "./mandatestyles";

export default function MandateSkeleton() {
  const classes = mandateStyles();

  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  )
}
