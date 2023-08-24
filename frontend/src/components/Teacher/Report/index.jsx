import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AttendanceReport from "./AttendanceReport.jsx";
import DateRangePickerFunc from "./DateRangePickerFunc.jsx";
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { CSVLink, CSVDownload } from "react-csv";
import { Button,Grid } from '@mui/material';
import { BACKEND_URL, TEACHER_EMAIL } from '../config';




const useStyles = makeStyles((theme) => ({
  root: {
//     backgroundColor: '#0F1E23',
    minHeight: '100vh',
    color: '#fff',
  },
   bodyContainer1: {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      marginLeft : theme.spacing(2),
      marginRight : theme.spacing(3),
      overflowX: 'auto',
      whiteSpace: 'nowrap',


    },
  bodyContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft : theme.spacing(2),
    marginRight : theme.spacing(3),
    marginTop: theme.spacing(4),

  },
  bigBox: {
    width: 'calc(70%)',
    height: '350px',
    backgroundColor: '#fff',
    marginBottom: theme.spacing(2),
    marginLeft : theme.spacing(1),
    borderRadius: '10px',
    overflow: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },

  biggestBox: {
    width: 'calc(100%)',
    height: '350px',
    backgroundColor: '#fff',
    marginBottom: theme.spacing(2),
    marginLeft : theme.spacing(1),
    borderRadius: '10px',
    overflow: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  regularBox: {
    width: 'calc(28%)',
    height: '350px',
    backgroundColor: '#fff',
    marginBottom: theme.spacing(2),
    marginLeft : theme.spacing(1),
    borderRadius: '10px',
    overflow: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  selectWrapper: {
       display: 'flex',
       alignItems: 'center',
       height:'27px'
     },
  largeBox: {
          width: 'calc(100%)',
          height: '100px',
          backgroundColor: '#fff',
          marginBottom: theme.spacing(2),
          marginLeft: theme.spacing(1),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
  inputLabel: {
         marginRight: theme.spacing(1),
       },
    formControl: {
         minWidth: 150,   // Set the height of the dropdown
         marginLeft: theme.spacing(1),
       },
  notificationContainer:{
     display: 'flex',
         flexDirection: 'column',
         alignItems: 'left',
         fontFamily: 'Poppins',
         fontSize: 11,
         color: 'black',
         overflow: 'hidden',
         paddingTop: theme.spacing(3),
         paddingLeft: '10px',

  },
    chartContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',


    },
  absenteesContainer: {
     display: 'flex',
         flexDirection: 'column',
         alignItems: 'left',
         fontFamily: 'Poppins',
         fontSize: 11,
         color: 'black',
         overflow: 'auto',
         paddingTop: '40px',
         paddingLeft: '10px',
  },
  boxContainer: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    overflow: 'auto'
  },
  name: {
  paddingBottom: 5,
  color: 'pink'
  }

}));

const Report = () => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [section, setSection] = React.useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (event) => {
            setSection(event.target.value);
            console.log('Selected option:', event.target.value);
  };

  const [classOptions, setClassOptions] = useState([]);

    // Fetch class data based on teacher's email
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/teachers/emailId/${TEACHER_EMAIL}`)
        .then((response) => {
          if (response.data) {
            setClassOptions(response.data.map((item) => ({ class_id: item.class_id })));
          }
        })
        .catch((error) => {
          console.error('Error fetching class data:', error);
        });
    }, []);

  const fetchData = (startDate, endDate, section) => {
    if (section && startDate && endDate) {
      axios
        .get(`http://localhost:8080/api/v1/attendance/class-records`, {
          params: {
            classId: section,
            startdate: startDate,
            enddate: endDate,
          },
        })
        .then((response) => {
          console.log('Attendance Data:', response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      console.log('Please select a class and date range');
    }
  };

  const handleDateChange = (start, end) => {
      setStartDate(start);
      setEndDate(end);
      fetchData(start, end, section);
  };

  useEffect(() => {
     const notSelectedParams = [];
     if (!startDate) {
       notSelectedParams.push('start date');
     }
     if (!endDate) {
       notSelectedParams.push('end date');
     }
     if (!section) {
       notSelectedParams.push('class');
     }
     setSnackbarMessage(notSelectedParams.length > 0 ? `Please select ${notSelectedParams.join(' and ')}.` : '');
   }, [startDate, endDate, section]);

  useEffect(() => {
     if (snackbarMessage) {
       const timer = setTimeout(() => {
         setSnackbarMessage('');
       }, 5000);
       return () => clearTimeout(timer);
     }
  }, [snackbarMessage]);



  return (
    <div className={classes.root}>
         <div className={classes.largeBox}>
             {/* Left side - DateRangePicker */}
             <DateRangePickerFunc onGetData={fetchData} classId={section} startDateProp={startDate} endDateProp={endDate}
              setStartDate={setStartDate} setEndDate={setEndDate} handleDateChange={handleDateChange} />
             <div className={classes.selectWrapper} style={{ marginRight: '40px' }}>
               <InputLabel className={classes.inputLabel} htmlFor="class-dropdown">
                 <span style={{ marginRight: '10px', marginLeft: '10px', fontSize: 18,  color: '#4150B7' }}>
                   CLASS :
                 </span>
               </InputLabel>
               <FormControl className={classes.formControl}>
                 <Select
                   value={section}
                   onChange={handleChange}
                   inputProps={{ name: 'class', id: 'class-dropdown' }}
                   displayEmpty // Set displayEmpty prop to show placeholder text
                 >
                   <MenuItem value="">
                     <em>Select</em> {/* Placeholder text */}
                   </MenuItem>
                   {classOptions.map((option) => (
                     <MenuItem key={option.class_id} value={option.class_id}>
                       {option.class_id}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
             </div>
         </div>
         <div className={classes.bodyContainer}>
            <div className={classes.bigBox}>
                <div className={classes.notificationContainer}>
                     <AttendanceReport type="main" startDate={startDate} endDate={endDate} classId={section}/>
                </div>
            </div>

            <div className={classes.regularBox}>
                <div className={classes.chartContainer}>
                    <AttendanceReport type="pie" startDate={startDate} endDate={endDate} classId={section}/>

                </div>
            </div>

        </div>
        <div className={classes.bodyContainer}>
        <AttendanceReport type="csv" startDate={startDate} endDate={endDate} classId={section} startDateProp={startDate} />

        </div>


        <Snackbar open={snackbarMessage !== ''} autoHideDuration={4000} onClose={() => setSnackbarMessage('')}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarMessage('')} severity="error">
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>
    </div>

  );
};

export default Report;
