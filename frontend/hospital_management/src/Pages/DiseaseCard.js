'use client'

import { Grid, Card, CardContent, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { CardActionArea, CardMedia } from '@mui/material'
import { patient } from '@/helpers/disease'
import Link from 'next/link'
// import {patientPageTwo} from '@/components/patientPageTwo.js'
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';

export default function DiseaseCard() {
   return (
      <div>
         <Container maxWidth='lg'>
            <Typography variant='h3' align='center'  color='primary' style={{ marginTop: '50px' }}>
               Diseases
            </Typography>
            <Grid container spacing={6} style={{ marginTop: '20px' }}>
               {patient.map((result, index) => (
                  <Grid item xs={6} md={3} sm={4} key={index}>
                     {/* here the redirection url is not defined when the page is complete than it work */}
                     <Link style={{ textDecoration: 'none' }} href='/doctorpage'>
                        <Card sx={{ maxWidth: 300, borderRadius: 3 }}>
                           <CardActionArea>
                              <CardMedia
                                 sx={{ height: 140 }}
                                 component='img'
                                 SSSSS
                                 image={result.image}
                              />
                              <CardContent>
                                 <Typography
                                    gutterBottom
                                    variant='h6'
                                    component='div'
                                 >
                                    {result.title}
                                 </Typography>
                                 <Typography variant='body2' color='text.secondary'>
                                    {result.description}
                                 </Typography>
                              </CardContent>
                           </CardActionArea>
                        </Card>
                     </Link>
                  </Grid>
               ))}
            </Grid>
         </Container>
      </div>
   )
}
