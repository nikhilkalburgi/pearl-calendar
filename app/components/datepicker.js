"use client"

import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DateComponent(props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={props.date} onChange={props.setDate} sx={{width: "100%"}}/>
    </LocalizationProvider>
  );
}
