import React from 'react';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

export default function BigCalendar() {
  return (
    <Calendar
      CustomToolbar={CustomToolbar}
      height="78vh"
      size={Size.Large}
    />
  );
}
