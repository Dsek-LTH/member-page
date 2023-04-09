import React from 'react';
import Calendar, { Size } from '../index';
import CustomToolbar from './Toolbar';

export default function BigCalendar({ hideToolbar = false, bookingsEnabled = false }) {
  return (
    <Calendar
      CustomToolbar={hideToolbar ? () => null : CustomToolbar}
      height="76vh"
      size={Size.Large}
      bookingsEnabled={bookingsEnabled}
    />
  );
}
