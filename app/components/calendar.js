import React from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { TextField } from '@mui/material';
import styles from '@/app/page.module.css';
import Select from '@/app/components/dropdown';

dayjs.extend(isBetweenPlugin);

// Styled component for custom day rendering
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered' && prop !== 'today',
})(({ theme, isSelected, isHovered, today }) => ({
  margin: 1,  
  borderRadius: 5,
  ...(today && {
    backgroundColor: '#81e8f9',
  }),
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.action.hover,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.hover,
    },
  })
}));

// Utility function to check if two days are the same
const isSameDay = (dayA, dayB) => {
  return dayA?.isSame(dayB, 'day');
};

// Day component with multiple selection capability
function Day(props) {
  const { day, selectedDays, hoveredDay, toggleDay, ...other } = props;

  const isSelected = selectedDays.some((selectedDay) => isSameDay(selectedDay, day));
  const isHovered = hoveredDay && isSameDay(hoveredDay, day);

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false} // Disable default selected styling
      isSelected={isSelected}
      isHovered={isHovered}
      onClick={() => toggleDay(day)}
    />
  );
}

// Main component for multiple date selection
export default function MultiDatePicker(props) {
  const [hoveredDay, setHoveredDay] = React.useState(null);
  const [selectedDays, setSelectedDays] = React.useState([]);
  const [counter, setCounter] = React.useState(1);
  const [customRepeatType, setCustomRepeatType] = React.useState("Days");

  // Define the start and end dates
  const startDate = props.startDate; // Example start date
  const endDate = dayjs(props.endDate); // Example end date

  // Function to generate a range of dates between start and end
  const generateDateRange = (start, end, counter, repeat) => {
    const dates = [];
    let currentDate = dayjs(start);

    while ((currentDate.isAfter(dayjs(startDate)) || currentDate.isSame(dayjs(startDate), 'day')) && (currentDate.isBefore(end) || currentDate.isSame(end, 'day'))) {
      dates.push(currentDate);
      currentDate = currentDate.add(1, repeat);
    }
    
    return dates.map((value, index)=>{
      if((index * counter) < dates.length){
        return dates[index * counter];
      }
    });
  };

  // Use effect to select dates on component mount
  React.useEffect(() => {
    console.log(startDate, props.repeatType)
    if(props.repeatType === "Daily") {       
        const dateRange = generateDateRange(startDate, endDate, 1, "day");
        setSelectedDays(dateRange);
    }else if(props.repeatType === "Custom" && customRepeatType === "Days") {
        const dateRange = generateDateRange(startDate, endDate, counter, "day");
        setSelectedDays(dateRange);
    }else {
      setSelectedDays([]);
    }
  }, [props.repeatType, props.startDate, props.endDate, counter, customRepeatType]);

  // Toggle a day in the selectedDays array
  const toggleDay = (day) => {
    let holdsTrue = false, count = 1, repeatType = "day";
    if(props.repeatType === "Monthly" || props.repeatType === "Yearly" || props.repeatType === "Weekly" ) {
      holdsTrue = true;
      repeatType = props.repeatType.toLowerCase().replace("ly","");
    }else if(props.repeatType === "Custom" && customRepeatType != "Days") {
      holdsTrue = true;
      count = counter;
      repeatType = customRepeatType.toLowerCase().replace("s","");
    }

    if(holdsTrue){
      const dates = generateDateRange(day, endDate, count, repeatType);

      setSelectedDays((prevSelected) => {
        const allDatesExist = dates.every((date) =>
          prevSelected.some((selectedDay) => isSameDay(selectedDay, date))
        );
  
        if (allDatesExist) {
          // If all the recurring dates already exist, remove them
          return prevSelected.filter(
            (selectedDay) =>
              !dates.some((date) => isSameDay(selectedDay, date))
          );
        } else {
          // If some or none of the recurring dates exist, add them
          return [...prevSelected, ...dates];
        }
      });
    }
  };

  const handleCounterChange =(event)=>{
    setCounter(event.target.value);
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {(props.repeatType === "Custom")?  
        <div className={styles.customOptionBox}>
          <div className={styles.leftBox} >
            <p>Every </p>
            <TextField
              sx={{width: "40%"}}
              label={``}
              value={counter}
              type="number"
              onChange={handleCounterChange}
            />
          </div>
          <div className={styles.rightBox}>
            <Select repeatType={customRepeatType} setRepeatType={setCustomRepeatType} options={['Days', 'Weeks', 'Months', 'Years']} />
          </div>
        </div>
      : null}
        <DateCalendar
          value={null} // No single value; managing multiple selections
          onChange={() => {}} // Disable default onChange
          showDaysOutsideCurrentMonth
          slots={{ day: Day }}
          slotProps={{
            day: (ownerState) => ({
              selectedDays: selectedDays,
              hoveredDay: hoveredDay,
              toggleDay: toggleDay,
              onPointerEnter: () => setHoveredDay(ownerState.day),
              onPointerLeave: () => setHoveredDay(null),
            }),
          }}
        />
    </LocalizationProvider>
  );
}
