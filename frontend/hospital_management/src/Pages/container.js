'use client'
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import { Grid, Typography, } from '@mui/material'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import '../styles/container.css'
export default function FixedContainer() {
   return (
      <React.Fragment>
         <CssBaseline />
         <Container
            sx={{
               width: '100%',
               height: '20%',
               marginTop: '2rem',
               textAlign: 'center',
            }}
         >
            <Grid
               container
               spacing={{ xs: 2, md: 3 }}
               columns={{ xs: 4, sm: 8, md: 12 }}
            >
               <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                     // padding: 2,
                     backgroundColor: '#fff',
                     color: '#13293D',
                  }}
               >
                  <MedicalServicesIcon sx={{ fontSize: 48 }} />
                  <Typography variant='h6' sx={{ padding: 1 }}>
                     Book an Appointment{' '}
                  </Typography>
                  <Typography variant='body2'>
                     You can register and get an appointment online for the
                     government hospitals
                  </Typography>
               </Grid>
               <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                     // padding: 2,
                     backgroundColor: '#fff',
                     color: '#13293D',
                  }}
               >
                  <VolunteerActivismIcon sx={{ fontSize: 48 }} />
                  <Typography variant='h6' sx={{ padding: 1 }}>
                     Specialties & Treatments{' '}
                  </Typography>
                  <Typography variant='body2'>
                     Experience the best-in-class medical treatments with over 30+
                     specialties.
                  </Typography>
               </Grid>
               <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                     // padding: 2,
                     backgroundColor: '#fff',
                     color: '#13293D',
                  }}
               >
                  <PersonAddIcon sx={{ fontSize: 48 }} />
                  <Typography variant='h6' sx={{ padding: 1 }}>
                     Find Doctor in Hospital{' '}
                  </Typography>
                  <Typography variant='body2'>
                     Trust the expert care of our doctors for your health and
                     well-being.
                  </Typography>
               </Grid>
               <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                     // paddingRight: 2,
                     backgroundColor: '#fff',
                     color: '#13293D',
                  }}
               >
                  <HealthAndSafetyIcon sx={{ fontSize: 48 }} />
                  <Typography variant='h6' sx={{ padding: 1 }}>
                     Health Checkup Packages{' '}
                  </Typography>
                  <Typography variant='body2'>
                     An executive checkup a year keeps your future hospital bill in
                     control
                  </Typography>
               </Grid>
            </Grid>
         </Container>
      </React.Fragment>
   )
}
