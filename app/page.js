"use client"

import React from 'react'
import styles from "./page.module.css";
import Select from "@/app/components/dropdown"
import DatePicker from '@/app/components/datepicker'
import Calendar from '@/app/components/calendar'

export default function Home() {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [repeatType, setRepeatType] = React.useState();
  return (
      <main className={styles.main}>
        <h2>Calendar</h2>
        <div className={styles.container}>
          <div className={styles.datePicker}>
            <p className={styles.datePickerLabel}>Start : </p>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className={styles.datePicker}>
            <p className={styles.datePickerLabel}>End : </p>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
          <Select repeatType={repeatType} setRepeatType={setRepeatType} options={['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom']} />
          <div style={{width: "600px"}}>

          {(!repeatType)? (null) : 
            <Calendar repeatType={repeatType} startDate={startDate} endDate={endDate} />
          }
          </div>
        </div>
      </main>
  );
}
