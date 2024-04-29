
'use client'
import { Grid, CardHeader, Divider } from '@mui/material'
import Image from 'next/image'
import { Container } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Chip from '@mui/material/Chip'
import { CircularProgress } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import { useGetAppointmentHistoryQuery } from '@/services/Query'

// eslint-disable-next-line no-unused-vars
const DoctorProfile = ({ id }) => {
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
  const doctor_id = localStorage.getItem('user_id')
  const { data: appointmentHistory, isLoading, isSuccess } = useGetAppointmentHistoryQuery(doctor_id);


  if (isLoading || !isSuccess) {
    return (
      <Container maxWidth='lg' p={2}>
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  const appointmentsByDate = (Array.isArray(appointmentHistory?.data) && (appointmentHistory?.data.length > 0))
    ? appointmentHistory?.data.reduce((acc = [], appointment = []) => {
      const date = appointment.appointment_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        patient_id: appointment?.patient?.patient_id,
        patient_name: appointment?.patient?.patient_name,
        doctor_name: appointment?.doctor?.employee?.employee_name,
        disease_name: appointment?.disease?.disease_name,
        appointment_time: appointment?.appointment_time,
        checked: appointment?.checked,
        appointment_id: appointment?.appointment_id,
      });
      return acc;
    }, {}) : [];

  console.log(appointmentsByDate, "appointmentsByDate")

  const DoctorName = localStorage.getItem('user_name')
  // console.log("doc name",DoctorName)

  return (
    <Container  maxWidth='lg' p={2} >
      <Grid container spacing={2}>
        <Grid container item bgcolor={'fff'} display={'flex'} Direction='column' style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}  >
          {
            <Image
              priority={true}
              src={appointmentHistory?.data[0].doctor.doctor_profile_picture || 'https://thumbs.dreamstime.com/b/doctor-portrait-21332357.jpg'} height={140}
              width={140}
              style={{ borderRadius: '50%', padding: 10 }}
            />
          }
          <Grid
            item
            xl={8}
            display='flex'
            Direction='column'
            justifyContent='center'
            margin={0}
            p={{ xs: 2, sm: 5 }}
            gap={10}


          >
            <>
              <Typography gutterBottom variant='h4' component='div'>
                {DoctorName}
                <Typography variant='body1' color='text.secondary'>
                  EXECUTIVE DOCTOR FORTIS C DOC | Fortis C-Doc
                </Typography>
              </Typography>
            </>
          </Grid>
        </Grid>
      </Grid>
      <br />
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
            content={`Dr ${DoctorName} is a renowned Neurosurgeon with over 20 years
                of experience. Dr ${DoctorName} is an adept in all disciplines of Brain
                and Spine Surgery including Brain tumor surgery among adults, as
                well as pediatric and Neonatal, endoscopic surgery,
                microvasculature decompression surger...`}
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
            icon={<HistoryIcon sx={{}} />}
            title={
              <Typography gutterBottom variant='h6'>
                History
              </Typography>
            }
            content={
              Object.keys(appointmentsByDate).map((date) => (
                // eslint-disable-next-line react/jsx-key
                <Accordion key={date} sx={{ boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.2)' }}>
                  <AccordionSummary
                    expandIcon={
                      // <Badge badgeContent={appointmentsByDate[date].length} color='primary'>
                      <ExpandMoreIcon />
                      // </Badge>
                    }
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography variant='h6'>Date - {date}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: 'flex', paddingBottom: 10 }}>
                      <Typography variant='body1'>Number of Appointments conducted = </Typography>{" "}
                      <Typography variant='body1'>{appointmentsByDate[date].length}</Typography>
                    </div>
                    <Typography variant='h6' paddingY={1}>
                      Patient Details -
                    </Typography>
                    {appointmentsByDate[date].map((appointment) => (
                      <Grid container key={appointment?.appointment_id}>
                        <Grid item xs={4} sm={4}>
                          <Typography variant='b1' component='h5'>
                            Name
                          </Typography>
                          <Typography variant='body2'>{appointment?.patient_name}</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          <Typography variant='b1' component='h5'>
                            Disease 
                          </Typography>
                          <Typography variant='body2'>{appointment?.disease_name}</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          <Typography variant='b1' component='h5'>
                            Status
                          </Typography>
                          {appointment?.checked === true ? (
                            <Chip label='Checked' size='small' sx={{ color: 'white', backgroundColor: '#35CFF4' }} />
                          ) : (
                            <Chip label='Not Checked' size='small' sx={{ color: 'white', backgroundColor: '#13293D' }} />
                          )}
                        </Grid>
                      </Grid>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))
            }
          />
        </Grid>

      </Grid>
    </Container>

  )
}
export default DoctorProfile