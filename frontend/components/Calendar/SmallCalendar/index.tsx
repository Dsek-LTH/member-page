import React from 'react';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

export default function SmallCalendar() {
  return (
    <Calendar
      CustomToolbar={CustomToolbar}
      height="350px"
      size={Size.Small}
    />
  );
}
