import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { Button, Box, Grid } from '@mui/material'
import Tooltip from '@material-ui/core/Tooltip';
import { PieChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink, CSVDownload } from "react-csv";
import csvicon from "../../../images/csvdownloader.png";

import IconButton from '@material-ui/core/IconButton';

const baseUrl = 'http://localhost:8080/api/v1/attendance';


const useStyles = makeStyles((theme) => ({
  root: {
      padding: theme.spacing(2),
  },
  tableContainer: {
      marginTop: theme.spacing(1),
  },
  pieChartContainer: {
      marginTop: theme.spacing(4),
  },
  tileHeadings: {
      fontSize: 20,
      fontFamily: 'Poppins',
      fontWeight: 700,
      color: 'black',
      padding: '10px',
      paddingTop: '5px',
  },
      chartContainer: {
      paddingTop: '15px',
  },
  sideTileHeadings: {
      fontFamily: 'Poppins',
      opacity:0.7,
      color: 'black',
  },
  cornerBox: {
      fontFamily: 'Poppins',
      fontSize: 16,
      fontWeight: 700,
      marginLeft: theme.spacing(100),
      textAlign: 'right',
      marginRight: '20px',
  },
  name: {
      fontFamily: 'Poppins',
      fontWeight: 400,
      color: 'black',
      fontSize : 15,
  },
  attendance: {
      fontFamily: 'Poppins',
      fontWeight: 550,
      color: 'black',
      fontSize: 15,
      opacity: 0.8,
  },
  noOfDays: {
      fontFamily: 'Poppins',
      fontWeight: 550,
      color: 'black',
      fontSize: 15,
      opacity: 0.8,
  },
  days: {
      fontFamily: 'Poppins',
      fontWeight: 700,
      color: '#CDCDCD',
      fontSize : 12,
      opacity:0.7,
  },
  align: {
        fontFamily: 'Poppins',
        fontWeight: 700,
        color: '#CDCDCD',
        fontSize : 12,
        opacity:0.7,
    },


}));
const formatDate = (date) => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
};

   const AttendanceReport = ({ type, startDate, endDate, classId }) => {
      const [attendanceData, setAttendanceData] = useState([]);
      const [totalDays, setTotalDays] = useState(0);
      const [studentname,setStudentname] = useState('');




      const fetchData = (startDate, endDate, classId) => {
        if (!classId || !startDate || !endDate) {
          console.log('Please select a class and date range');
          return;
        }

        const apiUrl = `${baseUrl}/class-records?classId=${classId}&startdate=${formatDate(
          startDate
        )}&enddate=${formatDate(endDate)}`;


        axios
          .get(apiUrl)
          .then((response) => {
            setAttendanceData(response.data);
            setTotalDays(calculateTotalDays(response.data));
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
        });
      };

      useEffect(() => {
        fetchData(startDate, endDate, classId);
      }, [startDate, endDate, classId]);
   const [stuData, setStuData] = useState([]);

           useEffect(() => {
             async function fetchStudentData() {
               try {
                 const response = await axios.get(`http://localhost:8080/students/classId/${classId}`);
                 const sdata = response.data;
                 const initialStudents = [...sdata].sort((a, b) => a.id - b.id).map((student, index) => ({
                   ...student,
                   rollNo: index + 1,
                   student_id: student.id,

                 }));

                 setStuData(initialStudents);
               } catch (error) {
                 console.error('Error fetching student data:', error);
               }
             }

             if (classId) {
               fetchStudentData();
             }
           }, [classId]);
    const calculateStudentAttendance = (data) => {
      const studentAttendance = {};
      data.forEach((entry) => {
          const { student_id, present } = entry;
          if (!studentAttendance[student_id]) {
            studentAttendance[student_id] = {
              name: '',
              Class: '',
              totalDays: 0,
              totalPresentDays: 0,
            };
          }

          const studentInfo = stuData.find((student) => Number(student.id) === student_id);

          if (studentInfo) {
            studentAttendance[student_id].name = `${studentInfo.first_name} ${studentInfo.last_name}`;
            studentAttendance[student_id].totalDays++;
            studentAttendance[student_id].Class = classId;
            if (present) {
              studentAttendance[student_id].totalPresentDays++;
            }
          }
        });


      Object.values(studentAttendance).forEach((student) => {
          student.attendancePercentage = (student.totalPresentDays / student.totalDays) * 100;
        });

        return Object.values(studentAttendance);
      };

      const calculateTotalDays = (data) => {
        const uniqueDates = new Set(data.map((entry) => entry.date));
        return uniqueDates.size;
    };

    const MainAttendanceTable = ({ studentAttendanceData, totalDays}) => { const classes = useStyles();
  return (
    <div>
      <div >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" className={classes.tileHeadings} component="h2"  style={{ color: 'black', marginLeft: 'calc(1.0%)'}}>Attendance Report</Typography>
            <Typography className={classes.sideTileHeadings} style={{ marginLeft: '600px' }}>TOTAL DAYS: <b>{totalDays}</b></Typography>
        </div>
        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableBody>
              {studentAttendanceData.map((student) => (
                <TableRow key={student.name}>
                  <TableCell><Typography className={classes.name}>{student.name}</Typography></TableCell>
                  <TableCell><Typography className={classes.attendance}>{student.attendancePercentage.toFixed(2)}%</Typography></TableCell>
                  <TableCell><Typography className={classes.noOfDays}>{student.totalPresentDays}</Typography></TableCell>
                  <TableCell><Typography className={classes.days}>DAYS</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>

      </div>
    );
  };
  const CSVReport = ({ studentAttendanceData, totalDays}) => {
    const classes = useStyles();
    const startDateString = startDate.toString();
    const startformatter = startDateString.substring(4,15)
    const endDateString = endDate.toString();
    const endformatter = endDateString.substring(4, 15);


    return (<div style={{ display: 'flex', justifyContent: 'flex-end',marginRight : '500px', marginLeft : '750px'}}>
    <CSVLink data={studentAttendanceData} title = "Download CSV Report" filename={`AttendanceReport_${startformatter}-${endformatter}.csv`}>
                  {studentAttendanceData.length > 0 && <Button variant="contained" style={{ backgroundColor: '#4150B7', color: '#fff' }}>
                                                                     Download CSV Report
                                                                   </Button>}
                  </CSVLink>
    </div>
    );
  };

  const PieChartSection = ({ studentAttendanceData, studentsWithLowAttendance }) => {
    const classes = useStyles();

    const lowAttendancePercentage = Math.round((
        studentsWithLowAttendance.length / studentAttendanceData.length
      ) * 100);
      const normalAttendancePercentage = 100 - lowAttendancePercentage;

      const pieChartData = [
        { id: 0, value: lowAttendancePercentage, label: 'Low', color: '#000000' },
        { id: 1, value: normalAttendancePercentage, label: 'Normal', color: '#4150B7' },
      ];

    return (
      <div className={classes.pieChartContainer}>
        <Typography variant="h6" className={classes.tileHeadings} component="h2"  style={{ color: 'black', marginLeft: 'calc(5%)' }}>Attendance Overview</Typography>
        <div className={classes.chartContainer}>
            <PieChart
              series={[
                {
                  data: pieChartData.map((item) => ({ ...item, percentage: item.value.toFixed(2) })),
                },
              ]}
              width={400}
              height={200}
              labels={({ datum }) => `${datum.label}: ${datum.percentage}%`}
              colorScale={pieChartData.map((item) => item.color)}
              legendSettings={{ position: 'bottom' }}

            />
        </div>
      </div>
    );
  };


  const studentAttendanceData = calculateStudentAttendance(attendanceData);


  const studentsWithLowAttendance = studentAttendanceData.filter(
    (student) => student.attendancePercentage < 75
  );
    return (
      <React.Fragment>
        {type === 'main' && <MainAttendanceTable studentAttendanceData={studentAttendanceData} totalDays={totalDays}  classId={classId}/>}
        {type === 'csv' && <CSVReport studentAttendanceData={studentAttendanceData} totalDays={totalDays} />}

        {type === 'pie' && (<PieChartSection studentAttendanceData={studentAttendanceData} studentsWithLowAttendance={studentsWithLowAttendance} classId={classId}/>)}

      </React.Fragment>

    );
    console.log(studentAttendanceData);
  };


export default AttendanceReport
