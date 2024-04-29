'use client'
import {
   Grid,
   Typography,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Card,
   CardHeader,
   Divider,
   CardContent,
   Paper,
   Skeleton,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { useAddAppointmentMutation, useGetDoctorTimesQuery } from '@/services/Query'
import { useState, useEffect } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import Image from 'next/image'
import { Container } from '@mui/system'
import useTimeSlots from '@/hooks/useTimeSlots'
import { toast } from 'react-toastify'
import moment from 'moment'
function BookAppoinment({ id, name, date }) {
   let data = {
      id: id,
      date: date
   }
   const { data: doctorTimes , refetch , isFetching : isLoading } = useGetDoctorTimesQuery(data)
   const [isBooking, setIsBooking] = useState(false)
   const[addAppointment] = useAddAppointmentMutation()
   const [selectedSlot, setSelectedSlot] = useState(null)
   const [openDialog, setOpenDialog] = useState(false)
   const [times, setTimes] = useState([])
   const [hiddentime, setHiddentime] = useState([])
   const { createTimeSlots } = useTimeSlots()
   // doctorTimes
   const ProfileCard = ({ icon, title, content }) => (
      <Card bgcolor={'#fff'} borderRadius={2} boxShadow={3} margin={2}>
         <CardHeader
            avatar={icon}
            title={title}
            sx={{ display: 'flex', alignItems: 'center' }}
         />
         <Divider />
         <CardContent>
            <Typography variant='body2' p={1}>
               {content}
            </Typography>
         </CardContent>
      </Card>
   )
   useEffect(() => {
      if (
         doctorTimes &&
         doctorTimes.data && !isLoading) {
         setTimes(doctorTimes.data.times)
         setHiddentime(createTimeSlots(doctorTimes.data.per_patient_time, doctorTimes.data.times))
      }
   }, [doctorTimes, isLoading])
   
   function formatTime(timeString) {
      const time = new Date(`2000-01-01T${timeString}`)
      return time.toLocaleString('en-US', {
         hour: 'numeric',
         minute: 'numeric',
         hour24: true,
      })
   }
   const handleOpenDialog = () => {
      setOpenDialog(true)
   }
   const handleCloseDialog = () => {
      setOpenDialog(false)
   }
   const handleSlotSelection = (timeSlot) => {
      setSelectedSlot(timeSlot)
   }
   const handleBookAppointment = async () => {
      handleOpenDialog()
   }
   const handleAppointment = async () => {
      setIsBooking((prev)=> !prev)
      if (!selectedSlot) {
         toast.error('Please select a time slot')
      }
      else if (hiddentime[selectedSlot.index]) {

         const payload = {
            appointment_time: hiddentime[selectedSlot.index][0],
            // appointment_date: moment().format('YYYY-MM-DD'),
            appointment_date: date,
            patient: localStorage.getItem('user_id'),
            doctor: id,
            disease: '72d9291c-f119-46f3-b0ed-44ff32697320',
            appointment_number: (selectedSlot.total_slots - selectedSlot.slots) + 1,
         }
         // addAppointment
         try {
            await addAppointment(payload).unwrap()
            refetch()
            toast.success('Appointment Booked Successfully')
            setIsBooking((prev)=> !prev)
            handleCloseDialog()
            setSelectedSlot(null)
         } catch (e) {
            setIsBooking((prev)=> !prev)
            toast.error('Something went wrong')
         }
      }
   }
   return (
      <Container maxWidth='lg' p={2}>
         <Grid
            container
            maxWidth='lg'
            boxShadow={1}
            spacing={5}
            display='flex'
            Direction='column'
         >
            <Grid item bgcolor={'fff'} display={'flex'} Direction='column'>
               {
                  isLoading ? (<>
                     <Skeleton
                        sx={{ border: '1px solid #E0E0E0' }}
                        variant="circular" height={150} width={150} />
                  </>) : (<>
                     <Image
                        priority={true}
                        src={doctorTimes?.data?.doctor_profile_picture || 'https://thumbs.dreamstime.com/b/doctor-portrait-21332357.jpg'}
                        height={140}
                        width={140}
                        style={{ borderRadius: '50%', padding: 10 }}
                     />
                  </>)
               }
               <Grid
                  item
                  xl={8}
                  // sm={8}
                  // bgcolor={"rebeccapurple"}
                  display='flex'
                  Direction='column'
                  justifyContent='center'
                  margin={0}
                  p={{ xs: 2, sm: 5 }}
                  gap={10}
               >
                  <>
                     <Typography gutterBottom variant='h4' component='div'>
                        {name}
                        <Typography variant='body1' color='text.secondary'>
                           EXECUTIVE DOCTOR FORTIS C DOC | Fortis C-Doc
                        </Typography>
                     </Typography>
                  </>
               </Grid>
            </Grid>
         </Grid>
         <br /> <br />
         <Grid container Direction='column' display={'flex'} rowSpacing={4}>
            {/* 1ST COLUMN */}
            <Grid item xs={12} sm={6}>
               <ProfileCard
                  icon={<PersonIcon sx={{ marginRight: 1 }} />}
                  title={<Typography gutterBottom variant='h6'> About</Typography>}
                  content={`Dr ${name} is a renowned Neurosurgeon with over 20 years
        of experience. Dr ${name} is an adept in all disciplines of Brain
        and Spine Surgery including Brain tumor surgery among adults, as
        well as pediatric and Neonatal, endoscopic surgery,
        microvascular decompression surger...`}
               />
               <br />
               <ProfileCard
                  icon={<SchoolIcon sx={{ marginRight: 1 }} />}
                  title={<Typography gutterBottom variant='h6'>Education</Typography>}
                  content='F.R.C.S.(London), F.R.C.S. (Neurosurgery), CCST (UK), Spine
        Fellowship (USA), Skull Base& Vascular Fellowship (USA)...'
               />
            </Grid>

              


            {/* 2ND COLUMN */}
            <Grid item sm={6} xs={12}>
               <Paper
                  elevation={2}
                  sx={{
                     padding: 2,
                     borderRadius: '4px',
                     '@media (min-width:600px)': {
                        marginLeft: 2,
                     },
                  }}
               >
                  <Typography gutterBottom variant='h5' mb={2}>
                     Appointment Time
                  </Typography>
                  <hr />
                  <Grid
                     container
                     spacing={1}
                     sx={{
                        display: 'flex',
                        '@media (min-width:600px)': {
                           justifyContent: 'center',
                        },
                     }}
                  >
                     {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                           <Grid item key={index} xs={6} sm={6} md={6}>
                              <Skeleton
                                 sx={{ border: '1px solid #13293D', borderRadius: '10px' }}
                                 variant="rectangular" height={60} />
                           </Grid>
                        ))
                     ) :
                        times.map((timeSlot, index) => (
                           <Grid item key={index} xs={12} sm={8} md={6}>
                              <Button
                                 variant='outlined'
                                 onClick={() => handleSlotSelection({ ...timeSlot, index: index + 1 })}
                                 disabled={!timeSlot?.slots}
                                 sx={{
                                    width: '100%',
                                    borderColor: selectedSlot?.index === (index + 1) ? '#2CD9C5' : '#000',
                                    borderRadius: '10px',
                                    backgroundColor: selectedSlot?.index === (index + 1) ? '#2CD9C5' : '#fff',
                                    color: selectedSlot?.index === (index + 1) ? '#fff' : '#000',
                                    position: 'relative',
                                    '&:hover': {
                                       borderColor: '#2CD9C5',
                                       backgroundColor: '#2CD9C5',
                                       color: '#fff',
                                    },
                                 }}
                              >
                                 <Typography variant='body2'>
                                    {formatTime(timeSlot.start_time)} -{' '}
                                    {formatTime(timeSlot.end_time)} :
                                 </Typography>
                                 <Typography
                                    variant='body2'
                                    sx={{ fontSize: '12px', marginTop: '4px' }}
                                 >
                                    {timeSlot.slots} slots available
                                 </Typography>
                              </Button>
                           </Grid>
                        ))}
                  </Grid>
                  <Grid
                     mt={2}
                     marginBottom={1}
                     display='flex'
                     justifyContent='center'
                  >
                     <Button disabled={!selectedSlot} variant='contained' onClick={handleBookAppointment}>
                        Book Appointment
                     </Button>
                  </Grid>
                  {/* FIRST Confirmation Dialog MODAL */}
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                     <DialogTitle>Confirm Appointment Booking</DialogTitle>
                     <DialogContent>
                        <DialogContentText>
                           Are you sure you want to book the appointment ?
                           An email confirmation will be sent to you shortly.
                        </DialogContentText>
                     </DialogContent>
                     <DialogActions>
                        <Button
                        disabled={isBooking}
                        onClick={handleCloseDialog} color='primary'>
                           Cancel
                        </Button>
                        <Button
                        disabled={isBooking}
                           onClick={handleAppointment}
                           color='primary'
                           autoFocus
                          
                        >
                           Confirm
                        </Button>
                     </DialogActions>
                  </Dialog>
               </Paper>
            </Grid>

         </Grid>
      </Container>
   )
}
export default BookAppoinment








