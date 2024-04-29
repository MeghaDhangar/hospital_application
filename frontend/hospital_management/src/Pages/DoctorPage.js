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
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import { Typography, Button, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useSpecialistDoctorMutation } from '@/services/Query'
import { useGetAllDiseasesQuery } from '@/services/Query'
import { useGetAllDoctorsQuery } from '@/services/Query'
import Image from 'next/image'
import { colors } from '../styles/theme'
import { useRouter } from 'next/navigation'


function DoctorPage() {
   const router = useRouter()
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
      // isLoading: isDoctorsLoading,
   } = useGetAllDoctorsQuery(selectedDiseases)
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
      let r1 = getDisease?.data.filter((e)=> e.disease_name === values)
      localStorage.setItem('disease' , r1[0].disease_id) // current disease id store in local storage
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

   const Typo = {
      fontWeight: 800,
      fontSize: '2.5rem',
   }

   const diseases = getDisease?.data?.filter((e) => e?.disease_status === true) || [
      'No Disease Found !',
   ]
   let doctors =
      filterDoc?.data?.length >= 1 && !DocFetch
         ? filterDoc?.data?.map((doctor) => doctor?.employee?.employee_name)
         : ['No Doctor Found !']

   let allDoctor = data ? data : getDoctors?.data || [];

   const addAppointment = (result) => {
      localStorage.setItem('all_disease' , JSON.stringify(result?.disease_specialist))
      router.push(`/bookappointment/${result?.doctor_id}+${formattedDate}+${result?.employee?.employee_name}`)
   }


   const DoctorCard = ({ result }) => {
      let diseases = result?.disease_specialist.map((e)=> e.disease_name) || [];

      let img2 = 'https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-doctor-icon-circle-png-image_2055257.jpg';
      let image = result?.doctor_profile_picture || img2;

      return (
         <Grid item xs={12} md={3} sm={6}>
            <Card sx={{ borderRadius: '2px', display: 'flex', flexDirection: 'column', boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px', padding: '20px' }}>
               {/* <CardActionArea sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}> */}
               <div style={{ textAlign: 'center'  }}>
                  <Image height={70} width={70} src={image} style={{ borderRadius: '50%', marginTop: '5px' }} />
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, marginTop: 1, color: colors.secondary }}>
                     {`Dr. ${result?.employee?.employee_name || ''}`}
                  </Typography>
               </div>

               <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, marginTop: 1, color: colors.primary, marginRight: '5px' }}>
                     Specialist:
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1, color: colors.primary }}>
                     {diseases?.join(', ') || 'No specialist'}
                     {/* {result?.disease_specialist[0]?.disease_name}  */}

                  </Typography>
               </div>


               <div>
                  <Button variant="contained" size="small" sx={{
                    display:'block',
                    margin:'0 auto',
                    marginTop:1
                  }}
                  onClick={() => addAppointment(result)}
                  >
                     Book Appointment
                  </Button>
               </div>
            </Card>
         </Grid>
      );
   };


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
                        options={diseases.map((disease) => disease?.disease_name)}
                        disabled={DiseaseLoading}
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
            <Typography variant='h4' align='center' style={{ marginTop: '50px', color: '#13293D' }}>
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
                        {allDoctor?.map((result) => (
                           <DoctorCard key={result?.doctor_id} result={result} />
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
