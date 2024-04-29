'use client'
// import { doctorwelcome } from '@/helpers/doctorwelcome'
import { useGetViewDoctorQuery } from '@/services/Query'
import { useState } from 'react'
import {
   Grid,
   Card,
   Typography,
   Button,
   Pagination,
   Skeleton,
   LinearProgress,
} from '@mui/material'
import docImage from '../assets/Doctorrrr.jpg'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import {colors} from '../styles/theme'

function ShowDoctors() {
   const [currentPage, setCurrentPage] = useState(1)
   const {
      data: doctorList,
      isLoading: docLoading,
      isFetching,
   } = useGetViewDoctorQuery(currentPage, {
      refetchOnMountOrArgChange: true,
   })

   const totalPages = doctorList?.data?.total_pages
   let currentDate=moment()
   const formattedDate = currentDate.format('YYYY-MM-DD');

   const handlePageChange = (event, value) => {
      setCurrentPage(value)
   }

   return (
      <>
         <LinearProgress style={{ visibility: isFetching ? 'visible' : 'hidden' }} />
         <Typography p={2} variant='h4' align='center' sx={{color:'#13293D'}}  >
           FIND DOCTOR
         </Typography>

         <Grid container spacing={2}>
            {docLoading
               ? Array.from({ length: 12 }).map((_, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
                       <Card
                          sx={{
                             maxWidth: 350,
                             height: '100%',
                             border: '1px solid #13293D',
                             margin: '10px',
                             padding: 1,
                             textAlign: 'center',
                             display: 'flex',
                             flexDirection: 'column',
                             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                             borderRadius: '8px',
                          }}
                       >
                          <Skeleton
                             variant='rectangular'
                             width='100%'
                             height={250}
                             style={{ borderRadius: '8px' }}
                          />
                          <Typography
                             variant='h5'
                             component='div'
                             sx={{ flex: '1', overflow: 'hidden', padding: '12px' }}
                          >
                             <Skeleton />
                             <Typography variant='body2' color='text.secondary'>
                                <Skeleton />
                             </Typography>
                          </Typography>
                          <Button disabled size='small' sx={{ border: '1px solid' }}>
                             <Skeleton />
                          </Button>
                       </Card>
                    </Grid>
                 ))
               : doctorList?.data?.results.map((doctor, index) => {
                    let image = doctor.doctor_profile_picture || docImage
                    return (
                       <Grid key={index} display={'flex'} justifyContent={'center'} item xs={12} sm={6} md={4} xl={3}>
                          <Card
                             sx={{
                                maxWidth: 350,
                                height: '100%',
                                border: '1px solid #13293D',
                                margin: '10px',
                                padding: 1,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
                                borderRadius: '8px', // Add some border-radius for a softer look
                             }}
                          >
                             <Image
                                width={300}
                                height={250}
                                // style={{ maxHeight: 250, objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                                src={image}
                                alt='Doctor'
                             />
                             <Typography
                                variant='h5'
                                component='div'
                                sx={{
                                   flex: '1',
                                   overflow: 'hidden',
                                   padding: '12px',
                                }}
                             >
                                {doctor.employee
                                   ? doctor.employee.employee_name
                                   : 'Unknown Doctor'}
                                <Typography variant='body2' color='text.secondary'>
                                   {doctor.disease_specialist.join(', ')}
                                </Typography>
                             </Typography>
                             <Link
                        href={`/bookappointment/${doctor?.doctor_id}+${formattedDate}+${doctor?.employee?.employee_name}`}
                        prefetch
                     >

                             <Button 
                                size='small'
                                sx={{
                                   border: '1px solid',
                                   '&:hover': {
                                      backgroundColor: '#13293d',
                                      color: '#fff',
                                   },
                                }}
                             >
                                Book Appointment
                             </Button>
                     </Link>

                          </Card>
                       </Grid>
                    )
                 })}
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
   )
}
export default ShowDoctors
