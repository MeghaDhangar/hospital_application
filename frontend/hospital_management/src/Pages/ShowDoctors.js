'use client'
import { useState } from 'react';
import { useGetViewDoctorQuery } from '@/services/Query';
import {
   Container,
   Grid,
   Typography,
   Pagination,
   LinearProgress,
   Card,
   Skeleton,
   
} from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import docImage from '../assets/doctorimg2.jpg';

function ShowDoctors() {
   const [currentPage, setCurrentPage] = useState(1);
   const {
      data: doctorList,
      isLoading: docLoading,
      isFetching,
   } = useGetViewDoctorQuery(currentPage, {
      refetchOnMountOrArgChange: true,
   });

   const totalPages = doctorList?.data?.total_pages;
   let currentDate = moment();
   // eslint-disable-next-line no-unused-vars
   const formattedDate = currentDate.format('DD-MM-YYYY');

   const handlePageChange = (event, value) => {
      setCurrentPage(value);
   };

   if (docLoading) {
      return (
         <Grid container spacing={2}>
            {Array.from({ length: 12 }).map((_, index) => (
               <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Card sx={{
                     maxWidth: 300,
                     height: '100%',
                     border: '1px solid #13293D',
                     margin: '10px',
                     padding: 1,
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                     borderRadius: '8px',
                  }}>
                     <Skeleton variant='rectangular' width='100%' height={100} style={{ borderRadius: '8px' }} />
                     <Typography variant='h5' component='div' sx={{ flex: '1', overflow: 'hidden', padding: '12px' }}>
                        <Skeleton />
                        <Skeleton />
                     </Typography>
               
                  </Card>
               </Grid>
            ))}
         </Grid>
      );
   } else if (isFetching || !doctorList || !doctorList.data || doctorList.data.results.length === 0) {
      return (
         <Container maxWidth='xl' sx={{ height: "50vh", alignItems: 'center' }}>
            <Grid mt={2} container spacing={2} justifyContent='center' alignItems='center'>
               <Image
                  src={"https://hospital0000.s3.ap-south-1.amazonaws.com/error+images/No+data.gif"}
                  width={350}
                  height={350}
                  alt="No appointment Here"
                  style={{ marginTop: 25 }}
               />
            </Grid>
         </Container>
      );
   } else {
      return (
         <>
            <LinearProgress style={{ visibility: isFetching ? 'visible' : 'hidden' }} />
            <Typography p={2} variant='h4' align='center' sx={{ color: '#13293D' }}></Typography>
            <Grid container spacing={2}>
               {doctorList.data.results.map((doctor, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3} >
                     <Card
                        sx={{
                           maxWidth: 280,
                           margin: 'auto',
                           padding: 1,
                           textAlign: 'center',
                           display: 'flex',
                           flexDirection: 'column',
                           boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
                           borderRadius: '8px',
                        }}
                     >
                        {/* Display doctor image */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                           <Image
                              width={90}
                              height={90}
                              src={doctor.doctor_profile_picture || docImage}
                              alt='Doctor'
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                           />
                        </div>
                        {/* Doctor details */}
                        <Typography variant='h5' component='div' sx={{ padding: '12px' }}>
                           {doctor.employee ? doctor.employee.employee_name : 'Unknown Doctor'}
                           <Typography variant='body2' color='text.secondary'>
                           {/* {diseases?.join(', ') || 'No specialist'} */}
                           {doctor.disease_specialist.map((disease, index) => (
                                 <span key={index}>{disease.disease_name } </span>
                              ))}
                           </Typography>
                        </Typography>
                     </Card>
                  </Grid>
               ))}
            </Grid>
            <Pagination
               count={totalPages}
               page={currentPage}
               onChange={handlePageChange}
               color='primary'
               shape='rounded'
               sx={{ margin: 4, float: 'right' }}
               disableNextButton={currentPage === totalPages}
               disablePrevButton={currentPage === 1}
            />
         </>
      );
   }
}

export default ShowDoctors;
