import React, { useState } from 'react';
import { Box, Grid, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LocalizationProvider, StaticDatePicker } from '@material-ui/lab';
import AdapterLuxon from '@material-ui/lab/AdapterLuxon';


export default function MonthlyCalendar() {

  const [value, setValue] = React.useState(new Date());

  const useStyles = makeStyles({
    outer: {
      width: "100%",
    },
  });
  const classes = useStyles();

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale="sv">
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={(newValue) => {
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}