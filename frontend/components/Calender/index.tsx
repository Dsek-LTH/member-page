import React, { useState } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


export default function Calender() {

  const useStyles = makeStyles({
    outer: {
      width: "100%",
      maxWidth: "250px",
      height: "250px",
      borderRadius: "10px",
    },
  });
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.outer}>

      </Paper>
    </div>

  )
}