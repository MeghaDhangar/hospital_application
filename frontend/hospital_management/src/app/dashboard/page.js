'use client'
// import Chart from './../../Pages/Chart'
import Card from '@mui/material/Card'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import datanotfound from '@/assets/dataNotFound.gif'
import { Avatar, IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import doctorImage from '../../assets/doctorillustration.png'
import Image from 'next/image'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import PeopleIcon from '@mui/icons-material/People'
import ListItemText from '@mui/material/ListItemText'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useGetDoctorIdQuery } from '../../services/Query'
import { Container, Grid, Button, Typography, Skeleton } from '@mui/material'
import { colors } from '@/styles/theme'
import { styled } from '@mui/material/styles'
import '@/styles/container.css'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { useAppointmentUpdateMutation } from '@/services/Query'
import { toast } from 'react-toastify'
import { useGetAppointmentInformationMutation } from './../../services/Query'
import { Chip, Switch, Input, CardHeader, CardContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useLeaveViewQuery } from '../../services/Query'
import { useAddPrescriptionMutation } from '../../services/Query'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/Pages/Chart'), {
   ssr: false
})
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
   },
   '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
   },
}))

const fadeInUp = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0 },
}


function DoctorProfile() {
   const requestAbortController = useRef(null)
   const userRole = localStorage.getItem('user_role')
   const doctorId = localStorage.getItem('user_id')
   const [dateData, setDateData] = useState([])
   const [isLoading, setIsLoading] = useState(false)
   const [highlightedDays, setHighlightedDays] = useState(getSpecificDates())
   const [isSwitchOn, setIsSwitchOn] = useState(false)
   const [selectedFile, setSelectedFile] = useState(null)
   const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
   const [isFileChosenError, setIsFileChosenError] = useState(false)
   const [open, setOpen] = useState(false)
   const [datesArray, setDatesArray] = useState([])


   const [addPrescription] = useAddPrescriptionMutation();
   const [appointmentUpdate] = useAppointmentUpdateMutation()
   const {
      data: appointments,
      isError,
      isLoading: dataloading,
      isSuccess,
      refetch
   } = useGetDoctorIdQuery(doctorId, { skip: userRole === 'Doctor' ? false : true })
   const isAppointmentsEmpty = isSuccess && appointments?.data?.length === 0;


   const docId = localStorage.getItem("user_id")
   const { data: holidays, isSuccess: isHolidaySuccess } = useLeaveViewQuery(docId)

   const [getAppointmentInfo, {
      data: appoint
   }] = useGetAppointmentInformationMutation()

   let isAdmin = userRole === 'Admin' || userRole === 'Manager' ? true : false


   var names = appointments?.data?.map(function (item) {
      return item['appointment_date']
   })
   useEffect(() => {
      if (dateData?.length > 0) {
         fetchHighlightedDays(initialValue)
         return () => requestAbortController.current?.abort()
      }
   }, [dateData])
   useEffect(() => {
      if (names?.length > 0) {
         setDateData(names)
      }
      if (dateData?.length > 0) {
         getSpecificDates()
      }
   }, [names?.length])
   // for holidays highlight in calender
   useEffect(() => {
      if (holidays?.data && isHolidaySuccess) {
         setDatesArray(holidays?.data?.map(item => item.date));
      }
   }, [holidays?.data, isHolidaySuccess])
   function getSpecificDates() {
      return dateData
   }

   function fakeFetch(date, { signal }) {
      return new Promise((resolve, reject) => {
         const timeout = setTimeout(() => {
            const currentMonth = dayjs(date).month()

            const daysToHighlight = getSpecificDates()
               .filter((dateStr) => dayjs(dateStr).month() === currentMonth)
               .map((dateStr) => dayjs(dateStr).date())

            resolve({ daysToHighlight })
         }, 500)

         signal.onabort = () => {
            clearTimeout(timeout)
            reject(new DOMException('aborted', 'AbortError'))
         }
      })
   }

   const initialValue = dayjs()

   function ServerDay(props) {
      const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

      const isSelected =
         !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0

      return (
         <>
            {isSelected ? (
               <Avatar
                  key={props.day.toString()}
                  overlap='circular'
                  sx={{ bgcolor: colors.secondary }}
               >
                  <PickersDay
                     {...other}
                     outsideCurrentMonth={outsideCurrentMonth}
                     day={day}
                  />
               </Avatar>
            ) : (
               <PickersDay
                  {...other}
                  outsideCurrentMonth={outsideCurrentMonth}
                  day={day}
               />
            )}
         </>
      )
   }



   const fetchHighlightedDays = (date) => {
      const controller = new AbortController()
      fakeFetch(date, {
         signal: controller.signal,
      })
         .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight)
            setIsLoading(false)
         })
         .catch((error) => {
            if (error.name !== 'AbortError') {
               throw error
            }
         })

      requestAbortController.current = controller
   }


   // for showing data in current month only
   const handleMonthChange = (date) => {
      if (requestAbortController.current) {
         requestAbortController.current.abort()
      }

      setIsLoading(true)
      setHighlightedDays([])
      fetchHighlightedDays(date)
   }

   // for changing time format
   function formatTime(timeString) {
      const [hours, minutes] = timeString.split(':')
      return `${hours}:${minutes}`
   }


   const shouldDisableDate = (date) => {
      const isSunday = date.day() === 0
      const formattedDate = date.format('YYYY-MM-DD')
      const isRandomDisabledDate = datesArray?.includes(formattedDate)

      return isSunday || isRandomDisabledDate
   }

   ///////////////////////////////////////////////////////





   const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0])
   }
   const handleSubmit = async () => {
      if (selectedFile) {
         setIsFileChosenError(true);

         const formData = new FormData()
         formData.append('file', selectedFile)

         try {
            const response = await fetch('/api/s3-upload', {
               method: 'POST',
               body: formData,
            })
            const data = await response.json()

            if (data) {
               try {
                  // Add prescription for each appointment
                  await addPrescription({
                     prescription_photo: data.imageUrl,
                     appointment: appoint?.data[0].appointment_id,
                  });
                  setIsSuccessDialogOpen(true);
                  setIsFileChosenError(false);
               } catch (error) {
                  console.error('Error adding prescription:', error);
               }
            } else {
               console.error('Failed to upload image')
            }
         } catch (error) {
            console.error('Error uploading image:', error)
         }
      } else {
         setIsFileChosenError(true)
      }
   }


   const handleDialogClose = () => {
      setIsSuccessDialogOpen(false);
      setSelectedFile(null);
      if (!selectedFile) {
         setIsFileChosenError(true);
      } else {
         setIsFileChosenError(false);
      }
   };

   const handleSwitchChange = async () => {
      // appointments
      try {
         const obj = {
            id: appoint?.data[0]?.appointment_id,
            pro: {
               checked: !isSwitchOn,
            },
         }
         await appointmentUpdate(obj)
         setIsSwitchOn(!isSwitchOn)
         refetch()
         toast.success('Status Changed Successfully')
      } catch (error) {
         console.log(error, "Caught")
         toast.error('Something went wrong !')
      }
   }


   const handleClickOpen = async (e) => {
      await getAppointmentInfo(e.appointment_id)
      setOpen(true)
   }

   const handleClose = async () => {
      setOpen(false);
   };


   if (dataloading) {
      return (


         <Container maxWidth="lg">
            <Grid container>
               <Grid item xs={12} sm={8}>
                  <Card
                     sx={{
                        borderRadius: 2,
                     }}
                  >
                     <Skeleton
                        variant='rectangular'
                        width='100%'
                        height={358}
                        animation='wave'
                     />
                  </Card>
               </Grid>
               <Grid item xs={12} sm={4}>
                  <Card
                     sx={{
                        width: '100%',
                        marginLeft: 2,
                        borderRadius: 2,
                        height: 358,
                     }}
                  >
                     <Skeleton
                        variant='rectangular'
                        width='100%'
                        height={358}
                        animation='wave'
                     />
                  </Card>
               </Grid>
               <Grid item xs={12} sm={12}>
                  <Card
                     sx={{

                        borderRadius: 2,
                        marginTop: 6,
                     }}
                  >
                     <Skeleton
                        variant='rectangular'
                        width='100%'
                        height={180}
                        animation='wave'
                     />
                  </Card>
               </Grid>
            </Grid>
         </Container>
      )

   } else {
      return (
         <div>
            {isAdmin ? (
               <Chart />
            ) : userRole === 'Doctor' ? (
               <Container maxWidth="lg" p={2}  >
                  <Grid container py={2}>
                     <Grid item xs={12} sm={8}>
                        <Card
                           sx={{
                              position: 'relative',
                              paddingY: 8,
                              paddingX: 2,
                              height: 335,
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                           }}
                        >
                           <div>
                              <Typography variant='h3' color='primary'>
                                 Hello,
                              </Typography>
                              <Typography variant='h3' color='secondary'>
                                 Dr.{" "} {
                                    localStorage.getItem('user_name')
                                 }
                              </Typography>

                              <Typography variant='body1' color='primary'>
                                 Your dedication and expertise brighten our
                                 <br></br> hospital every day. We appreciate your commitment <br></br>to excellence. Wishing you a day filled with success <br></br> and positive outcomes. Thank you for being an <br></br>invaluable part of our team.
                              </Typography>
                           </div>
                           <Grid item sx={{
                              display: {
                                 xs: 'none',
                                 md: 'block'
                              }
                           }}>
                              <Image

                                 src={doctorImage}
                                 alt='Doctor illustration'
                                 height={300}
                                 style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0',
                                 }}
                              />
                           </Grid>
                        </Card>
                     </Grid>

                     <Grid item xs={12} sm={4}>
                        <Grid container>
                           <Grid item xs={12} sm={12} px={2}>
                              <Box
                                 sx={{
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                 }}
                              >
                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                       defaultValue={initialValue}
                                       shouldDisableDate={shouldDisableDate}
                                       loading={isLoading}
                                       onMonthChange={handleMonthChange}
                                       renderLoading={() => <DayCalendarSkeleton />}
                                       slots={{
                                          day: ServerDay,
                                       }}
                                       slotProps={{
                                          day: {
                                             highlightedDays,
                                          },
                                       }}
                                    />
                                 </LocalizationProvider>
                              </Box>
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={12} sm={12} mt={2}>
                        <div style={{ display: 'flex' }}>
                           <PeopleIcon />
                           <Typography variant='h6' color='primary'>
                              Upcoming appointments
                           </Typography>
                        </div>
                        <Box
                           sx={{
                              width: '100%',
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                              marginTop: 1,
                           }}
                        >
                           {isError ? (
                              <div
                                 style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                 }}
                              >
                                 <Image
                                    src={datanotfound}
                                    alt='data not found'
                                    height={150}
                                    width={150}
                                 />
                                 <Typography variant='h6' color='primary'>
                                    Data Not found
                                 </Typography>
                              </div>
                           ) :
                              isAppointmentsEmpty ? (
                                 <div
                                    style={{
                                       display: 'flex',
                                       flexDirection: 'column',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                    }}
                                 >
                                    <Image
                                       src={datanotfound}
                                       alt='data not found'
                                       height={150}
                                       width={150}
                                    />
                                    <Typography variant='h6' color='primary'>
                                       Data Not found
                                    </Typography>
                                 </div>)
                                 :
                                 (
                                    <nav aria-label='secondary mailbox folders'>
                                       <List>
                                          {appointments?.data?.map((e) => (
                                             // eslint-disable-next-line react/jsx-key
                                             <ListItem>
                                                <div style={{ flex: 1 }}>
                                                   <ListItemText
                                                      primary={e.patient.patient_name}
                                                      primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                   />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                   <ListItemText
                                                      primary={e.disease.disease_name}
                                                      primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                   />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                   <ListItemText
                                                      primary={formatTime(e.appointment_time) + ' / ' + e.appointment_date}
                                                      primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                   />
                                                </div>

                                                {e.checked ? (
                                                   <IconButton
                                                      style={{ color: '#35CFF4' }}
                                                   >
                                                      <FiberManualRecordIcon />
                                                   </IconButton>
                                                ) : (
                                                   <IconButton disabled>
                                                      <FiberManualRecordIcon />
                                                   </IconButton>
                                                )}

                                                <Button
                                                   variant='contained'
                                                   size='small'
                                                   onClick={() => handleClickOpen(e)}
                                                >
                                                   view
                                                </Button>
                                                <BootstrapDialog
                                                   onClose={handleClose}
                                                   aria-labelledby='customized-dialog-title'
                                                   open={open}
                                                >
                                                   <DialogTitle
                                                      sx={{ m: 0 }}
                                                      id='customized-dialog-title'
                                                   >
                                                      Appointment Information
                                                   </DialogTitle>
                                                   <IconButton
                                                      aria-label='close'
                                                      onClick={handleClose}
                                                      sx={{
                                                         position: 'absolute',
                                                         right: 0,
                                                         top: 0,
                                                         color: (theme) =>
                                                            theme.palette.grey[500],
                                                      }}
                                                   >
                                                      <CloseIcon />
                                                   </IconButton>
                                                   <DialogContent dividers>
                                                      {Array.isArray(
                                                         appoint?.data
                                                      ) &&
                                                         appoint?.data?.map(
                                                            (e, i) => (
                                                               <Grid
                                                                  item
                                                                  key={i}
                                                                  xs={12}
                                                                  sm={12}
                                                                  md={12}
                                                                  lg={12}
                                                                  variants={fadeInUp}
                                                                  initial='hidden'
                                                                  animate='visible'
                                                               >
                                                                  <Card sx={{ backgroundColor: '#fff' }}>
                                                                     <CardHeader
                                                                        avatar={
                                                                           <Avatar sx={{ bgcolor: '#13293D' }} aria-label='recipe'>
                                                                              {e?.doctor?.employee?.employee_name.split('')[0]}
                                                                           </Avatar>
                                                                        }
                                                                        title={e?.doctor?.employee?.employee_name}
                                                                        subheader={formatTime(e.appointment_time) + ' ' + e.appointment_date}
                                                                     />
                                                                     <CardContent>
                                                                        <Chip
                                                                           label={'Disease Name: ' + e?.disease?.disease_name}
                                                                           sx={{ backgroundColor: '#13293D', color: 'white' }}
                                                                        />
                                                                     </CardContent>
                                                                     <CardContent>
                                                                        <Chip
                                                                           label={'Patient Name: ' + e?.patient?.patient_name}
                                                                           sx={{ backgroundColor: '#13293D', color: 'white' }}
                                                                        />
                                                                     </CardContent>
                                                                     <CardContent>
                                                                        <Chip
                                                                           label={'Appointment No.: ' + e?.appointment_number}
                                                                           sx={{ backgroundColor: '#13293D', color: 'white' }}
                                                                        />
                                                                     </CardContent>
                                                                     <CardContent>
                                                                        <Switch
                                                                           checked={e.checked || isSwitchOn}
                                                                           onChange={handleSwitchChange}
                                                                           color='primary'
                                                                           size='small'
                                                                           disabled={e.checked}
                                                                           sx={{
                                                                              '& .MuiSwitch-thumb': {
                                                                                 backgroundColor: e.checked || isSwitchOn ? '#13293D' : 'white',
                                                                              },
                                                                              '& .MuiSwitch-track': {
                                                                                 backgroundColor: e.checked || isSwitchOn ? 'rgba(19, 41, 61, 0.5)' : '#35CFF4',
                                                                              },
                                                                           }}
                                                                        />
                                                                        {(e.checked || isSwitchOn) ? (
                                                                           <div>
                                                                              <Input type='file' onChange={handleFileChange} />
                                                                              <Button
                                                                                 variant='contained'
                                                                                 color='primary'
                                                                                 size='small'
                                                                                 onClick={handleSubmit}
                                                                              >
                                                                                 Add Prescription
                                                                              </Button>
                                                                              {/* {isFileChosenError && (
                                                                                 <p style={{ color: 'red' }}>Please choose the file.</p>
                                                                              )} */}
                                                                           </div>
                                                                        ) : (
                                                                           <p>Unchecked</p>
                                                                        )}
                                                                     </CardContent>
                                                                     <Dialog open={isSuccessDialogOpen} onClose={handleDialogClose}>
                                                                        <DialogTitle>Prescription Submitted Successfully!</DialogTitle>
                                                                        <DialogContent>
                                                                           <DialogContentText>
                                                                              {isFileChosenError ? 'Error: Please choose the file before closing.' : ''}
                                                                           </DialogContentText>
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                           <Button onClick={handleDialogClose} color='primary'>
                                                                              OK
                                                                           </Button>
                                                                        </DialogActions>
                                                                     </Dialog>
                                                                  </Card>

                                                               </Grid>
                                                            )
                                                         )}
                                                   </DialogContent>
                                                </BootstrapDialog>
                                             </ListItem>
                                          ))}
                                       </List>
                                    </nav>
                                 )}
                        </Box>
                     </Grid>
                  </Grid>
               </Container>
            ) : null}
         </div>
      )
   }
}

export default DoctorProfile
