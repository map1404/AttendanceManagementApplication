import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import classIcon from "../../../images/classicon.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import userPic from '../../../images/user.png';
import { useEffect} from 'react';
import presentation from '../../../images/presentation.png'
import teachernotification from '../../../images/teachernotification.png'
import { BACKEND_URL, TEACHER_EMAIL } from '../config'; // Import the BACKEND_URL and TEACHER_EMAIL from the config.js file


const useStyles = makeStyles((theme) => ({
  root: {
//     backgroundColor: '#0F1E23',
    color: '#fff',
    padding: theme.spacing(2),
  },
   profileContainer: {
     display: 'flex',
     alignItems: 'center',
     marginBottom: theme.spacing(4),
     marginLeft: theme.spacing(4),
   },
   profilePic: {
     width: theme.spacing(8),
     height: theme.spacing(8),
     borderRadius: '50%',
     marginRight: theme.spacing(2),
   },
  greetings: {
    color:'black',

    fontSize: 30,
    fontWeight: 'medium',
    marginBottom: theme.spacing(1),
  },
  message: {
    fontSize: 13,
    color: 'black',

    fontWeight: 'light',
  },
  bodyContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  bigBox: {
    position: 'relative',
    width: 'calc(33.33% - 20px)', // Adjust the width to fit three boxes in one row with spacing
    height: '400px', // Adjust the height as needed
    backgroundColor: '#fff',
    marginBottom: theme.spacing(4),
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  boxHeading: {
    position: 'sticky',
    top: 0,
    margin: '8px',
    padding: '0 8px',

    fontWeight: 500,
    color: '#000',
    zIndex: 1,
  },

  regularBox: {
    position: 'relative',
    width: 'calc(33.33% - 20px)', // Adjust the width to fit three boxes in one row with spacing
    height: '400px', // Adjust the height as needed
    backgroundColor: '#fff',
    marginBottom: theme.spacing(4),
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  today: {
    backgroundColor: '#6E88C9',
    color: '#fff',
  },
  classItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    borderBottom: '1px solid #CFCFCF',
    textAlign: 'left',

  },
  classIcon: {
    width: '60px !important',
    height: '60px !important',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },


  className: {
    marginRight: theme.spacing(2),

    fontWeight: 600,
    color: '#000',
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'right',
  },
  classDate: {
    marginLeft: 'auto',

    color: '#ccc',
    textAlign: 'right',
  },
  classSubstituted: {
    marginRight: theme.spacing(2),

    color: '#ccc',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  classTotal: {
    marginLeft: 'auto',
    alignSelf: 'flex-end',
    color: '#777',
    fontSize: '0.9rem',
    textAlign: 'right',
  },
  separator: {
    borderTop: '1px solid #777',
    marginTop: theme.spacing(2),
  },
  boxContent: {
    height: 'calc(100% - 40px)',
    overflow: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    scrollbarColor: 'transparent transparent',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
  },
  scrollContainer: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(1),
    maxHeight: '100%',
  },
  notificationBox: {
    height: 'calc(100% - 40px)',
    overflow: 'auto',
    paddingBottom: theme.spacing(2),
    scrollbarColor: 'transparent transparent',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #CFCFCF',
  },
  notificationProfilePic: {
    width: '60px !important',
    height: '60px !important',
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
  notificationContent: {
    flex: 1,
    marginRight: theme.spacing(2),
    color: '#000',
  },
  calenderContainer: {
    width: '100%',
    height: 'calc(100% - 60px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveIcon: {
    color: '#F47458',
    marginRight: theme.spacing(1),
  },
  declineIcon: {
    color: '#000',
    marginRight: theme.spacing(1),
  },
}));




const Dashboard = () => {
  const classes = useStyles();
  const currentDate = new Date();
  const tileClassName = ({ date }) => {
    if (date.toDateString() === currentDate.toDateString()) {
      return `${classes.today} react-calendar__tile--today`;
    }
    return '';
  };


   const [teacherId,setTeacherId] = useState(0);
   const [first_name, setFirstName] = useState("");
   const [last_name, setLastName] = useState("");

   const [data, setData] = useState([]); // Add this line to define the 'data' state variable

   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch(`${BACKEND_URL}/teachers/emailId/${TEACHER_EMAIL}`);
         const jsonData = await response.json();
         setData(jsonData);


         if (jsonData && jsonData.length > 0) {
           setFirstName(jsonData[0].first_name);
           setLastName(jsonData[0].last_name);
           setTeacherId(jsonData[0].id)
         }
       } catch (error) {
         console.error('error fetching data:', error);
       }
     };
     setData([]);
     fetchData();
   }, []);

    const [notificationsData, setNotificationsData] = useState([]);
    console.log(teacherId)
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/leave/teacher?updatedBy=${teacherId}`
          );
          const jsonData = await response.json();
          console.log(jsonData)
          const pendingnotifs = jsonData.filter((record) => record.status=== 'Pending')



          const data = await Promise.all(
            pendingnotifs.map(async (record) => {
            console.log(record.student_id)
              try {
                const studentresponse = await axios.get(`http://localhost:8080/students/id/${record.student_id}`);
                const studentData = studentresponse.data;
                console.log(studentresponse)

                return {
                  ...record,
                  first_name: studentData.first_name,
                  last_name: studentData.last_name,

                };
              } catch (error) {
                console.error('Error fetching student data:', error);
                return record; // Return the original record if student data fetch fails
              }
            })
          );

          setNotificationsData(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }, [teacherId]);

    // Render your component here using the notificationsData state


const handleApprove = (notification) => {
   let formattedMessage;
   if(notification.start_date===notification.end_date){
       formattedMessage = `
              <strong>Name:</strong> ${notification.first_name} ${notification.last_name}<br>
              <strong>Class:</strong> ${notification.class_id}<br>
              <strong>Date:</strong> ${notification.start_date}<br>
              <strong>Type:</strong> ${notification.type}<br>
              <strong>Reason:</strong> ${notification.description}
            `;
            }else{
       formattedMessage = `
           <strong>Name:</strong> ${notification.first_name} ${notification.last_name}<br>
           <strong>Class:</strong> ${notification.class_id}<br>
           <strong>From:</strong> ${notification.start_date}<br>
           <strong>To:</strong> ${notification.end_date}<br>
           <strong>Type:</strong> ${notification.type}<br>
           <strong>Reason:</strong> ${notification.description}
         `;
   }
     confirmAlert({
       title: 'Approve',
       message: <div dangerouslySetInnerHTML={{ __html: `<strong>Are you sure you want to approve the request for:</strong><br><br>${formattedMessage}` }} />,
      buttons: [
      {
        label: 'Yes',
        onClick: () => {
          // Update the status property
          notification.status = 'Approved';

          // Send a PUT request to update the notification status
          axios.put(`http://localhost:8080/api/v1/leave/${notification.leave_id}`, notification)
            .then(() => {
              toast.success('You have approved the Leave Request');
              // Refresh the page after a short delay
              setTimeout(() => {
                window.location.reload();
              }, 500);
            })
            .catch((error) => {
              console.error('Error updating notification:', error);
            });
        },
      },
      {
        label: 'No',
        onClick: () => {},
      },
    ],
  });
};

const handleDecline = (notification) => {
    let formattedMessage;
    if(notification.start_date===notification.end_date){
       formattedMessage = `
              <strong>Name:</strong> ${notification.first_name} ${notification.last_name}<br>
              <strong>Class:</strong> ${notification.class_id}<br>
              <strong>Date:</strong> ${notification.start_date}<br>
              <strong>Type:</strong> ${notification.type}<br>
              <strong>Reason:</strong> ${notification.description}
            `;
            }else{
       formattedMessage = `
           <strong>Name:</strong> ${notification.first_name} ${notification.last_name}<br>
           <strong>Class:</strong> ${notification.class_id}<br>
           <strong>From:</strong> ${notification.start_date}<br>
           <strong>To:</strong> ${notification.end_date}<br>
           <strong>Type:</strong> ${notification.type}<br>
           <strong>Reason:</strong> ${notification.description}
         `;
       }
    confirmAlert({
    title: 'Approve',
    message: <div dangerouslySetInnerHTML={{ __html: `<strong>Are you sure you want to deny the request for:</strong><br><br>${formattedMessage}` }} />,
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          // Update the status property
          notification.status = 'Denied';

          // Send a PUT request to update the notification status
          axios.put(`http://localhost:8080/api/v1/leave/${notification.leave_id}`, notification)
            .then(() => {
              toast.error('You have Denied the Leave Request');
              // Refresh the page after a short delay
              setTimeout(() => {
                window.location.reload();
              }, 500);
            })
            .catch((error) => {
              console.error('Error updating notification:', error);
            });
        },
      },
      {
        label: 'No',
        onClick: () => {},
      },
    ],
  });
};


// Filter out the notifications that have been approved or declined
const filteredNotificationsData = notificationsData.filter(
  (notification) => !notification.approved && !notification.declined
);





//   Define a state to store the total number of students for each class
  const [classStudentCounts, setClassStudentCounts] = useState({});

  useEffect(() => {
    // Fetch the total number of students for each class and store it in the state
    const fetchStudentCounts = async () => {
      try {
        const response = await Promise.all(
          data.map(async (item) => {
            const classId = item.class_id;
            const response = await fetch(`${BACKEND_URL}/students/classId/${classId}/studentCount`);
            const jsonData = await response.json();
            return { classId, studentCount: jsonData };
          })
        );

        // Create a new object with classId as keys and studentCount as values
        const studentCounts = response.reduce((acc, { classId, studentCount }) => {
          acc[classId] = studentCount;
          return acc;
        }, {});

        setClassStudentCounts(studentCounts);
      } catch (error) {
        console.error('Error fetching student counts:', error);
      }
    };

    fetchStudentCounts();
  }, [data]);




  return (
<div className={classes.root}>
      <div style={{ marginTop: '20px' }}>
        {/* Add margin or padding to ensure content below the header */}
        <div className={classes.profileContainer}>
          <Avatar src={userPic} alt="Profile Picture" className={classes.profilePic} />
          <div>
            {/* Use the dynamic firstName and lastName here */}
            <Typography variant="h4" className={classes.greetings} style={{ fontWeight: 500, fontSize: 30 }}>
              Hey {first_name}!
            </Typography>
            <Typography variant="body1" className={classes.message} style={{ fontWeight: 300, fontSize: 15 }}>
              We hope you have a nice day.
            </Typography>
        </div>
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.bigBox}>
          <Typography
              variant="h5"
              className={classes.boxHeading}
              style={{  fontWeight: 600, fontSize: 20, color: 'black', marginLeft: 'calc(5%)', marginTop: 'calc(5%)' }}
            >
              Calendar
            </Typography>
            <div className={classes.boxContent}>
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className={classes.calendarContainer}>
              <Calendar value={currentDate} tileClassName={tileClassName} />
            </div>
          </div>
          </div>
        </div>
        <div className={classes.regularBox}>
          <Typography
              variant="h5"
              className={classes.boxHeading}
              style={{  fontWeight: 600, fontSize: 20, color: 'black', marginLeft: 'calc(5%)', marginTop: 'calc(5%)' }}
            >
              Assigned Classes
            </Typography>
            <div className={classes.boxContent}>





          <div style={{ background: '#fff', padding: '10px', color: '#000' }}>
  {/* Display the fetched data */}
  {data.map((item) => (
    <div
      key={item.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #ccc',
        marginBottom: '50px',
      }}
    >
      {/* Increase the marginLeft value to move the presentation icon towards the right */}
      <img src={presentation} alt="Item Image" style={{ width: '50px', height: '50px', marginRight: '10px', marginLeft: '70px' }} />
      <div>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{item.class_id}</p>
        <p>Total Students: {classStudentCounts[item.class_id] || 0}</p>
      </div>
    </div>

  ))}
  </div>
</div>

        </div>
        <div className={classes.regularBox}>
          <Typography
              variant="h5"
              className={classes.boxHeading}
              style={{ fontWeight: 600, fontSize: 20, color: 'black', marginLeft: 'calc(5%)', marginTop: 'calc(5%)' }}
            >
              Notifications
            </Typography>
            <div className={classes.boxContent}>
          <div className={classes.notificationBox}>
            {filteredNotificationsData.map((notification) => (
              <div key={notification.leave_id} className={classes.notificationItem}>
                <Avatar
                  src={teachernotification}
                  alt="Sender Profile Picture"
                  className={classes.notificationProfilePic}
                />
                <div className={classes.notificationContent}>
                  <Typography variant="body1">{notification.first_name} {notification.last_name} </Typography>
                  <Typography variant="body1">Class : {notification.class_id}</Typography>
                  {notification.start_date === notification.end_date ? (
                  <Typography variant="body2">{notification.start_date}</Typography>
                  ):(
                  <Typography variant="body2">{notification.start_date} - {notification.end_date}</Typography>
                  )}

                  <Typography variant="body3">{notification.type} </Typography>
                </div>
                {!notification.approved && !notification.declined && (
                  <div className={classes.notificationButtons}>
                    <CheckIcon
                      className={classes.approveIcon}
                      onClick={() => handleApprove(notification)}
                    />

                    <CloseIcon
                      className={classes.declineIcon}
                      onClick={() => handleDecline(notification)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
