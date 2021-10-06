import React, { useEffect, useState } from 'react';
import { Badge, Box, Grid, Paper, Skeleton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LocalizationProvider, PickersDay, StaticDatePicker } from '@material-ui/lab';
import AdapterLuxon from '@material-ui/lab/AdapterLuxon';
import { useEventsQuery } from '../../generated/graphql';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';


export default function SmallCalendar() {
  const { loading, data } = useEventsQuery();
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation('calendar');

  const [value, setValue] = React.useState(new Date());
  const [eventDates, setEventDates] = React.useState<Set<DateTime>>(new Set());

  useEffect(() => {
    if(!loading && data){
      data.events.forEach(event => {
        setEventDates(prev => new Set(prev.add(DateTime.fromJSDate(event.start_datetime))))
        setEventDates(prev => new Set(prev.add(DateTime.fromJSDate(event.end_datetime))))
      })
    }
  }, [data])

  const useStyles = makeStyles({
    outer: {
      width: "100%",
      borderRadius: "10px",
    },
  });
  const classes = useStyles();

  if (loading || !initialized)
    return (
      <Paper className={classes.outer}>
        <Skeleton />
      </Paper>
    )

  if (!data?.events)
    return (
      <p>{t('failedLoadingCalendar')}</p>
    )

  console.log(eventDates);
  

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale="sv">
      <Paper className={classes.outer}>
        <Box>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={value}
            onChange={(newValue) => {
            }}
            renderInput={(params) => <TextField {...params} />}
            renderDay={(day, _value, DayComponentProps) => {
              return (
                <Badge
                  key={day.toString()}
                  overlap="circular"
                  badgeContent={eventDates.has(day) ? '🌚' : undefined }
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
            }}
          />
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}