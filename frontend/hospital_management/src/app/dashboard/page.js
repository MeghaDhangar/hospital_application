
"use client"
import Chart from '@/Pages/Chart';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useGetDoctorIdQuery } from '../../services/Query';
import { Container, Grid, Button, Typography, Skeleton } from '@mui/material';
import Link from 'next/link';

function FetchData() {
   const userRole = localStorage.getItem('user_role')
   const doctorId = localStorage.getItem('user_id');
   const { data: appointment = [], error, isLoading } = useGetDoctorIdQuery(doctorId, {
      skip: userRole === 'Doctor' ? false : true
   });

   let isAdmin = userRole === 'Admin' || userRole === 'Manager' ? true : false;

   if (isLoading) {
      return (
         <Container maxWidth='lg'>
            <Grid mt={3} container spacing={2}>
               {[1, 2, 3, 4, 5].map((_, i) => (
                  <Grid
                     item
                     key={i}
                     xs={12}
                     sm={6}
                     md={4}
                     sx={{ paddingBottom: '1rem' }}
                  >
                     <Card sx={{ backgroundColor: '#C4D0DC' }}>
                        <Skeleton variant="rectangular" width="100%" height={250} animation="wave" />
                     </Card>
                  </Grid>
               ))}
            </Grid>
         </Container>
      )
   } else if (error) {
      return <p> No Appointment Here {error}</p>
   } else {
      return (
         <div>
            {isAdmin ? (
               <Chart />
            ) : userRole === 'Doctor' ? (
               <Container maxWidth='lg'>
                  <Grid container spacing={3}>
                     {Array.isArray(appointment?.data) && appointment.data.map((appointmentItem, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                           <Card
                              sx={{
                                 backgroundColor: '#13293D',
                                 borderRadius: 2,
                                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                              }}
                           >
                              <CardHeader
                                 avatar={
                                    <Avatar
                                       alt='Avatar'
                                       src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMjX02hunzz3i3dG7PG7J2AM61C5AVahSHBg&usqp=CAU'
                                       sx={{ width: 60, height: 60, border: '2px solid white' }}
                                    />
                                 }
                                 title={
                                    <Typography
                                       sx={{
                                          display: 'inline',
                                          fontSize: '1.2rem',
                                          color: 'white',
                                          fontWeight: 'bold',
                                       }}
                                       component='h4'
                                       variant='body1'
                                    >
                                       {appointmentItem?.doctor?.employee?.employee_name}
                                    </Typography>
                                 }
                                 subheader={
                                    <Typography sx={{ color: 'white' }}>
                                       {`${appointmentItem?.appointment_time} ${appointmentItem?.appointment_date}`}
                                    </Typography>
                                 }
                              />

                              <CardContent>
                                 <Typography sx={{ color: 'white', marginTop: '0.5rem' }}>
                                    {`Patient Name: ${appointmentItem?.patient?.patient_name}`}
                                 </Typography>
                                 <Typography sx={{ color: 'white' }}>
                                    {`Appointment Number: ${appointmentItem?.appointment_number}`}
                                 </Typography>
                                 <Typography sx={{ color: 'white' }}>
                                    {`Disease Name: ${appointmentItem?.disease?.disease_name}`}
                                 </Typography>
                                 <Link href={`dashboard/individualappointment/${appointmentItem?.appointment_id}`}>
                                    <Button
                                       variant='contained'
                                       size='small'
                                       sx={{
                                          backgroundColor: '#A7AFB7', '&:hover': { backgroundColor: '#A7AFB7' },
                                          width: '6rem',
                                          height: '2rem',
                                          fontSize: '200',
                                          cursor: 'pointer',
                                          marginTop: '1rem',
                                       }}
                                    >
                                       View
                                    </Button>
                                 </Link>
                              </CardContent>
                           </Card>
                        </Grid>
                     ))}
                  </Grid>
               </Container>
            ) : null}
         </div>
      );
   }
}

export default FetchData;