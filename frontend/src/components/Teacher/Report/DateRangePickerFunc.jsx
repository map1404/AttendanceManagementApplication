import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { CalendarToday, ArrowDropDown } from '@mui/icons-material';

const DateRangePickerFunc = ({ onGetData, classId, startDateProp, endDateProp, setStartDate, setEndDate }) => {
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    onGetData(startDateProp, endDateProp, classId);
  }, [startDateProp, endDateProp, classId]);

  const buttonStyle = {
    color: 'black',
    backgroundColor: '#fff',
    fontSize: 13,
    height: '27px',
    width: '150px',
  };

  // Function to disable dates after the current date
  const isDateDisabled = (date) => {
    const currentDate = new Date();
    return date <= currentDate;
  };

  const startDate = startDateProp;
  const endDate = endDateProp;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <span style={{ marginRight: '10px', marginLeft: '10px', fontSize: 18, color: '#4150B7' }}>DATE : </span>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="MMM dd yy"
          filterDate={isDateDisabled} // Disable dates after the current date
          customInput={
            <Button variant="outlined" size="small" style={buttonStyle} startIcon={<CalendarToday />}>
              {startDateProp instanceof Date ? startDateProp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
              <ArrowDropDown style={{ marginLeft: '5px' }} />
            </Button>
          }
        />
        <span style={{ marginRight: '10px', marginLeft: '10px', color: 'black' }}>
          {' '}
          <b>-</b>{' '}
        </span>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="MMM dd"
          filterDate={isDateDisabled} // Disable dates after the current date
          customInput={
            <Button variant="outlined" size="small" style={buttonStyle} startIcon={<CalendarToday />}>
              {endDateProp instanceof Date ? endDateProp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
              <ArrowDropDown style={{ marginLeft: '5px' }} />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default DateRangePickerFunc;
