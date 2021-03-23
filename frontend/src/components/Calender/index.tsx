//@ts-nocheck
import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DateTime } from 'luxon';


export default function Calender() {

  const useStyles = makeStyles({
    outer: {
      width: "100%",
      minWidth: 310,
      borderRadius: 10,
    },
  });
  
  // These overrides are not documented anywhere. You need to use the inspector to get the classnames.
  const calendarOverrides = createMuiTheme({
    overrides: {
      MuiPickersBasePicker: {
        container: {
          borderRadius: 10,
        },
      },
      MuiPickersStaticWrapper: {
        staticWrapperRoot: {
          borderRadius: 10,
        }
      }
    }
  });

  const classes = useStyles();
  const [date, changeDate] = useState<MaterialUiPickersDate>(DateTime.fromJSDate(new Date()));

  return (
    <div>
      <Paper className={classes.outer}>
        <ThemeProvider theme={calendarOverrides}>
          <DatePicker
            autoOk
            disableToolbar
            orientation="landscape"
            variant="static"
            openTo="date"
            value={date}
            onChange={changeDate}
          />
        </ThemeProvider>
      </Paper>
    </div>
  )
}