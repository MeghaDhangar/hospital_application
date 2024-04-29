
'use client'
import { Grid, CardHeader, Divider } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { Container } from '@mui/material'
import Badge from '@mui/material/Badge'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Chip from '@mui/material/Chip'
import HistoryIcon from '@mui/icons-material/History'
import { display } from '@mui/system'
let arr =  [
 {
     appointment_id: "a0600720-09c4-4d99-a6ef-1416b433e977",
     appointment_number: 1,
     checked: false,
     appointment_time: "09:00:00",
     appointment_date: "2023-12-15",
     created_at: "2023-12-10T16:02:17.699000Z",
     patient: {
         patient_id: "ea6e944f-0a27-4c25-b3b2-1fa126a7bd4a",
         patient_name: "Keshav Agrawal"
     },
     doctor: {
         doctor_id: "e5e6f8c6-3c66-4de5-b7df-d5e2bcff7ba5",
         employee: {
             employee_id: "98b655c7-2904-4464-8dd7-287df87f9cb0",
             employee_name: "Jagrati Junwal"
         }
     },
     disease: {
         disease_id: "c5f17ce4-5757-4f15-91aa-0232dca38e3e",
         disease_name: "Common cold"
     }
 },
 {
     appointment_id: "ce0a6bb4-42b6-4c0d-ab1f-e59eec3926f0",
     appointment_number: 1,
     checked: false,
     appointment_time: "02:00:00",
     appointment_date: "2023-12-12",
     created_at: "2023-12-12T08:08:52.935000Z",
     patient: {
         patient_id: "61cc8d7f-34f6-44d4-ae26-5fea62eb0036",
         patient_name: "Prashant"
     },
     doctor: {
         doctor_id: "e5e6f8c6-3c66-4de5-b7df-d5e2bcff7ba5",
         employee: {
             employee_id: "98b655c7-2904-4464-8dd7-287df87f9cb0",
             employee_name: "Jagrati Junwal"
         }
     },
     disease: {
         disease_id: "72d9291c-f119-46f3-b0ed-44ff32697320",
         disease_name: "Asthma"
     }
 },
 {
     appointment_id: "9e5299a0-ddd3-4e2e-a112-15a19b194429",
     appointment_number: 1,
     checked: false,
     appointment_time: "02:00:00",
     appointment_date: "2023-12-16",
     created_at: "2023-12-14T05:03:57.991000Z",
     patient: {
         patient_id: "2586e4f6-d171-4f73-bb61-5c2469dad398",
         patient_name: "Aditi Agrawal"
     },
     doctor: {
         doctor_id: "e5e6f8c6-3c66-4de5-b7df-d5e2bcff7ba5",
         employee: {
             employee_id: "98b655c7-2904-4464-8dd7-287df87f9cb0",
             employee_name: "Jagrati Junwal"
         }
     },
     disease: {
         disease_id: "72d9291c-f119-46f3-b0ed-44ff32697320",
         disease_name: "Asthma"
     }
 }
]
const appointmentsByDate = arr.reduce((acc =[], appointment =[]) => {
 const date = appointment.appointment_date;
 if (!acc[date]) {
     acc[date] = [];
 }
 acc[date].push({
     patient_id: appointment.patient.patient_id,
     patient_name: appointment.patient.patient_name,
     doctor_name: appointment.doctor.employee.employee_name,
     disease_name: appointment.disease.disease_name,
     appointment_time: appointment.appointment_time,
     checked: appointment.checked,
 });
 return acc;
}, {});
console.log(appointmentsByDate);
const DoctorProfile = () => {
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
 return (
    <Container maxWidth='lg' p={2}>
       <Grid container boxShadow={1} spacing={2}>
          <Grid container item bgcolor={'fff'} display={'flex'} Direction='column'>
             {
                //   isLoading ? (<>
                //      <Skeleton
                //         sx={{ border: '1px solid #E0E0E0' }}
                //         variant="circular" height={150} width={150} />
                //   </>) : (<>
                <Image
                   priority={true}
                   src='https://thumbs.dreamstime.com/b/doctor-portrait-21332357.jpg'
                   height={140}
                   width={140}
                   style={{ borderRadius: '50%', padding: 10 }}
                />
                // </>)
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
                      Name
                      <Typography variant='body1' color='text.secondary'>
                         EXECUTIVE CHAIRMAN FORTIS C DOC | Fortis C-Doc
                      </Typography>
                   </Typography>
                </>
             </Grid>
          </Grid>
       </Grid>
       <Grid container marginTop={2} spacing={2}>
          <Grid xs={12} sm={6}>
             <ProfileCard
                icon={<PersonIcon sx={{ marginRight: 1 }} />}
                title={
                   <Typography gutterBottom variant='h6'>
                      {' '}
                      About
                   </Typography>
                }
                content={`Dr ${name} is a renowned Neurosurgeon with over 20 years
                of experience. Dr ${name} is an adept in all disciplines of Brain
                and Spine Surgery including Brain tumor surgery among adults, as
                well as pediatric and Neonatal, endoscopic surgery,
                microvascular decompression surger...`}
             />
             <br />
             <ProfileCard
                icon={<SchoolIcon sx={{ marginRight: 1 }} />}
                title={
                   <Typography gutterBottom variant='h6'>
                      Education
                   </Typography>
                }
                content='F.R.C.S.(London), F.R.C.S. (Neurosurgery), CCST (UK), Spine
                 Fellowship (USA), Skull Base& Vascular Fellowship (USA)...'
             />
          </Grid>
          <Grid item xs={12} sm={6}>
             <ProfileCard
                icon={<HistoryIcon sx={{ marginRight: 1 }} />}
                title={
                   <Typography gutterBottom variant='h6'>
                      {' '}
                      History
                   </Typography>
                }
                content={arr.map((appointment) =>(
                   // eslint-disable-next-line react/jsx-key
                   <Accordion sx={{ boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.2)'}}>
                   <AccordionSummary
                      expandIcon={
                         <Badge badgeContent={appointment.length} color='primary'>
                            <ExpandMoreIcon />
                         </Badge>
                      }
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                   >
                      <Typography variant='h6'>Date - {appointment.appointment_date}</Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ marginLeft: 1 }}>
                      <div style={{ display: 'flex', paddingBottom: 10 }}>
                         <Typography variant='body2'>
                            Number of Appointments conducted =
                         </Typography>
                         <Typography variant='body2'>{arr.length}</Typography>
                      </div>
                      <Typography variant='h6' paddingY={1}>
                         Patient Details -
                      </Typography>
                      <Grid container>
                         <Grid item xs={4} sm={4}>
                            <Typography variant='b1' component='h5'>
                               Name
                            </Typography>
                            <Typography variant='body2'>{appointment.patient.patient_name}</Typography>
                         </Grid>
                         <Grid item xs={4} sm={4}>
                            <Typography variant='b1' component='h5'>
                               Disease
                            </Typography>
                            <Typography variant='body2'>{appointment.disease.disease_name}</Typography>
                         </Grid>
                         <Grid item xs={4} sm={4}>
                            <Typography variant='b1' component='h5'>
                               Status
                            </Typography>
                            {
                               appointment.checked === true ? <Chip label='Attended'  size='small' sx={{ color: 'white', backgroundColor: '#35CFF4' }} /> : <Chip label='Not Attended'  size='small' sx={{ color: 'white', backgroundColor: '#35CFF4' }} />
                            }
                         </Grid>
                      </Grid>
                   </AccordionDetails>
                </Accordion>))
             }
             />
          </Grid>
       </Grid>
    </Container>
 )
}
export default DoctorProfile