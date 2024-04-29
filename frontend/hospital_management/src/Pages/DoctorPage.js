'use client'
import { useState } from 'react'
import dayjs from 'dayjs'
import { DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Grid from '@mui/system/Unstable_Grid/Grid'
import Container from '@mui/material/Container'
import { Card, CardContent, Skeleton } from '@mui/material'
import { CardActionArea } from '@mui/material'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'
import { Typography, Button, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useSpecialistDoctorMutation } from '@/services/Query'
import { useGetAllDiseasesQuery } from '@/services/Query'
import { useGetAllDoctorsQuery } from '@/services/Query'
import Image from 'next/image'
import { colors } from '../styles/theme'

function DoctorPage() {
   const [filterDoctor, { isLoading: filterDocLoading, isError }] =
      useSpecialistDoctorMutation()
   // filter use
   const { data: getDisease, isLoading: DiseaseLoading } = useGetAllDiseasesQuery()
   const {
      data: getDoctors,
      isFetching: docListLoading,
      isLoading: docLoading,
   } = useGetAllDoctorsQuery()

   const [data, setData] = useState('')

   const [selectedDate, setSelectedDate] = useState(dayjs(new Date())) // Initial date value
   const formattedDate = selectedDate.format('YYYY-MM-DD');
   const [selectedDiseases, setSelectedDiseases] = useState([]) // Initial diseases value
   const [selectedDoctor, setSelectedDoctor] = useState([]) // Initial diseases value
   const isDateDisabled = (date) => {
      return date.isBefore(dayjs(), 'day');
    };
  
   const {
      data: filterDoc,
      isFetching: DocFetch,
      isLoading: isDoctorsLoading,
   } = useGetAllDoctorsQuery(selectedDiseases)
   console.log(filterDoc)
   let fill = {
      disease: selectedDiseases,
      day: formattedDate,
      doctor: selectedDoctor,
   }

   const styles = {
      container: {
         backgroundImage: `url(${'https://www.carehospitals.com/indore/assets/images/banners/doctorlist-banner.jpg'})`,
         backgroundSize: 'cover',
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center',
         color: 'white', 
         padding: '2rem',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
      },
   }

   const handleDateChange = (date) => {
      setSelectedDate(date)
   }

   const handleDiseasesChange = (event, values) => {
      setSelectedDiseases(values)
      setSelectedDoctor('')
   }

   const handleDoctorChange = (event, values) => {
      setSelectedDoctor(values)
   }

   const handleSubmit = async (event) => {
      try {
         event.preventDefault()
         let res = await filterDoctor(fill).unwrap()
         if (selectedDoctor) {
            setData(
               res?.data.filter((e) => e?.employee?.employee_name === selectedDoctor)
            )
         } else {
            setData(res?.data)
         }
      } catch (err) {
         console.warn(err)
      }
   }

   // const [status, updatedStatus] = useState()

   const Typo = {
      fontWeight: 800,
      fontSize: '2.5rem',
   }

   // for filter use
   const diseases = getDisease?.data?.map((disease) => disease?.disease_name) || [
      'No Disease Found !',
   ]
   let doctors =
      filterDoc?.data?.length >= 1 && !DocFetch
         ? filterDoc?.data?.map((doctor) => doctor?.employee?.employee_name)
         : ['No Doctor Found !']

   // default all doctor show
   let allDoctor = data ? data : getDoctors?.data || []
   //  selectedDoctor  &&  allDoctor  &&  data

   const DoctorCard = ({ result }) => {
      let diseases = result?.disease_specialist || []
      let img2 =
         'https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-doctor-icon-circle-png-image_2055257.jpg'
      let image = result?.doctor_profile_picture || img2

      return (
         <Grid item xs={12} md={3} sm={6}>
            <Card sx={{ borderRadius: '5px', height: '100%' }}>
               <CardActionArea sx={{ minHeight: 240 }}>
                  <CardContent>
                     <Grid container alignItems='center' spacing={2}>
                        <Grid item>
                           <Image height={50} width={50} src={image} style={{borderRadius:'50%'}} />
                        </Grid>
                        <Grid item sx={{ paddingLeft: 2, flex: 1 }}>
                           <Typography
                              variant='body2'
                              color='#2CD9C5'
                              sx={{ fontWeight: 700 }}
                           >
                              Name
                           </Typography>
                           <Typography gutterBottom variant='h6' component='div'>
                              {`Dr. ${result?.employee?.employee_name || ''}`}
                           </Typography>
                        </Grid>
                     </Grid>

                     <Typography
                        variant='body2'
                        // color='#35CFF4'
                        sx={{ fontWeight: 700, marginTop: 1.5, color:colors.secondary }}
                     >
                        Disease Specialist
                     </Typography>
                     <Box marginBottom={2}>
                        {diseases?.map((item, index) => (
                           <Chip
                              key={index}
                              size='small'
                              label={item || 'Some item'}
                              sx={{
                                 marginRight: 1,
                                 marginTop: 1,
                                 backgroundColor: '#2CD9C51A',
                              }}
                           />
                        ))}
                     </Box>

                     <Link
                        href={`/bookappointment/${result?.doctor_id}+${formattedDate}+${result?.employee?.employee_name}`}
                        prefetch
                     >
                        <Button variant='contained' size='small'>
                           Book Appointment
                        </Button>
                     </Link>
                  </CardContent>
               </CardActionArea>
            </Card>
         </Grid>
      )
      
   }

   const DoctorCardSkeleton = () => (
      <Grid item xs={12} md={3} sm={6}>
         <Card sx={{ borderRadius: '5px', height: '100%' }}>
            <CardActionArea sx={{ minHeight: 285 }}>
               <CardContent>
                  <Grid container alignItems='center' spacing={2}>
                     <Grid item>
                        <Skeleton variant='rect' width={50} height={50} />
                     </Grid>
                     <Grid item sx={{ paddingLeft: 2, flex: 1 }}>
                        <Typography
                           variant='body2'
                           color='#2CD9C5'
                           sx={{ fontWeight: 700 }}
                        >
                           <Skeleton width={50} />
                        </Typography>
                        <Typography gutterBottom variant='h6' component='div'>
                           <Skeleton width={120} />
                        </Typography>
                     </Grid>
                  </Grid>

                  <Skeleton
                     variant='rect'
                     width={100}
                     height={20}
                     style={{ marginTop: 1, backgroundColor: '#2CD9C5' }}
                  />
                  <Box display='flex' marginBottom={2}>
                     {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                           key={index}
                           variant='rect'
                           width={30}
                           height={20}
                           style={{
                              marginRight: 1,
                              marginTop: 1,
                              backgroundColor: '#2CD9C51A',
                           }}
                        />
                     ))}
                  </Box>

                  <div style={{ paddingTop: 2 }}>
                     <Button variant='contained' size='small' disabled>
                        <Skeleton width={120} />
                     </Button>
                  </div>
               </CardContent>
            </CardActionArea>
         </Card>
      </Grid>
   )

   return (
      <div>
         {DiseaseLoading && (
            <div>
               <Box sx={{ width: '100%' }}>
                  <LinearProgress />
               </Box>
            </div>
         )}
         <div style={styles.container}>
            <Container maxWidth='lg'>
               <Typography variant='h4' align='center' style={Typo}>
                  Book Your Appointment
               </Typography>

               <Grid container spacing={5} style={{ marginTop: '1rem' }}>
                  <Grid item xs={12} sm={3} md={3.5}>
                     <Typography variant='body2' sx={{ marginBottom: '6px' }}>
                        Select Disease
                     </Typography>
                     <Autocomplete
                        freeSolo
                        id='tags-outlined'
                        options={diseases}
                        disable={DiseaseLoading}
                        value={selectedDiseases}
                        onChange={handleDiseasesChange}
                        sx={{
                           background: 'white',
                           outline: 'none',
                           borderRadius: '5px',
                        }}
                        disableClearable
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              //  label="Search input"
                              InputProps={{
                                 ...params.InputProps,
                                 placeholder: DiseaseLoading
                                    ? 'Loading...'
                                    : 'Disease',
                                 type: 'Search',
                              }}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item xs={12} sm={3} md={3.5}>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoItem label='Select Date'>
                           <MobileDatePicker
                              defaultValue={dayjs(new Date())}
                              format='DD-MM-YYYY'
                              views={['year', 'month', 'day']}
                              value={selectedDate}
                              onChange={handleDateChange}
                              shouldDisableDate={isDateDisabled} // Pass the custom validation function

                              sx={{ background: 'white', borderRadius: '5px' }}
                           />
                        </DemoItem>
                     </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={3} md={3.5}>
                     <Typography variant='body2' sx={{ marginBottom: '6px' }}>
                        Select Doctor
                     </Typography>
                     <Autocomplete
                        freeSolo
                        id='tags-outlined'
                        options={doctors || []}
                        value={selectedDoctor?.toString()}
                        onChange={handleDoctorChange}
                        sx={{
                           background: 'white',
                           outline: 'none',
                           borderRadius: '5px',
                        }}
                        disableClearable
                        disabled={DocFetch} // Set disabled based on isFetching
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              // label='Select doctor'
                              InputProps={{
                                 ...params.InputProps,
                                 placeholder: DocFetch
                                    ? 'Loading...'
                                    : 'Select a doctor',
                                 type: 'Search',
                              }}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item xs={12} sm={3} md={1.5}>
                     <Button
                        variant='contained'
                        size='large'
                        disabled={docListLoading || DiseaseLoading}
                        onClick={handleSubmit}
                        sx={{ marginTop: '25px', height: '56px', width: '100px' }}
                     >
                        {filterDocLoading ? (
                           <div>
                              <Box sx={{ color: '#fff' }}>
                                 <CircularProgress color='inherit' size={20} />
                              </Box>
                           </div>
                        ) : (
                           'Search'
                        )}
                     </Button>
                  </Grid>
               </Grid>
            </Container>
         </div>
         {/* // all doctor view  */}
         <Container maxWidth='xl'>
            <Typography variant='h4' align='center' style={{ marginTop: '50px', color:'#13293D' }}>
              FIND DOCTOR
            </Typography>

            {filterDocLoading || docListLoading || docLoading ? (
               <Grid container spacing={4} style={{ marginTop: '20px' }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                     <DoctorCardSkeleton key={index} />
                  ))}
               </Grid>
            ) : (
               <>
                  {isError ? (
                     <div>Oops ! Something went Wrong</div>
                  ) : (
                     <Grid container spacing={6} style={{ marginTop: '20px' }}>
                        {allDoctor?.map((result, index) => (
                           <DoctorCard key={index} result={result} />
                        ))}
                     </Grid>
                  )}
               </>
            )}
         </Container>
      </div>
   )
}
export default DoctorPage
