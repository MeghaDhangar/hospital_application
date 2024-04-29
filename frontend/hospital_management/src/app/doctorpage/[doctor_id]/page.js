'use client'
import { useState } from 'react'
import dayjs from 'dayjs'
import { DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Grid from '@mui/system/Unstable_Grid/Grid'
import Container from '@mui/material/Container'
import { Card, CardContent } from '@mui/material'
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

function DoctorPage() {
   const [filterDoctor, { isLoading: filterDocLoading, isError }] =
      useSpecialistDoctorMutation()
   // filter use
   const { data: getDisease, isLoading: DiseaseLoading } = useGetAllDiseasesQuery()
   const { data: getDoctors, isFetching: docListLoading } = useGetAllDoctorsQuery()

   const [data, setData] = useState('')

   const [selectedDate, setSelectedDate] = useState(dayjs(new Date())) // Initial date value
   const [selectedDiseases, setSelectedDiseases] = useState([]) // Initial diseases value
   const [selectedDoctor, setSelectedDoctor] = useState([]) // Initial diseases value

   const {
      data: filterDoc,
      isFetching: DocFetch,
      // isLoading: isDoctorsLoading,
   } = useGetAllDoctorsQuery(selectedDiseases)
   console.log(filterDoc)
   let fill = {
      disease: selectedDiseases,
      day: selectedDate,
      doctor: selectedDoctor,
   }

   const styles = {
      container: {
         backgroundImage: `url(${'https://e0.pxfuel.com/wallpapers/597/471/desktop-wallpaper-hospital-medical-care.jpg'})`,
         backgroundSize: 'cover',
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center',
         color: 'white', // Adjust text color based on your background
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
               res?.data.filter((e) => e.employee.employee_name === selectedDoctor)
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
   const diseases = getDisease?.data?.map((disease) => disease.disease_name) || [
      'No Disease Found !',
   ]
   let doctors =
      filterDoc?.data?.length >= 1 && !DocFetch
         ? filterDoc?.data?.map((doctor) => doctor?.employee?.employee_name)
         : ['No Doctor Found !']

   // default all doctor show
   let allDoctor = data ? data : getDoctors?.data || []
   //  selectedDoctor  &&  allDoctor  &&  data

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
                                    ? 'loading...'
                                    : 'disease',
                                 type: 'search',
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
                        options={doctors}
                        value={selectedDoctor.toString()}
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
                              //  label="Search input"
                              InputProps={{
                                 ...params.InputProps,
                                 placeholder: DocFetch
                                    ? 'loading...'
                                    : 'select a doctor',
                                 type: 'search',
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
            <Typography variant='h3' align='center' style={{ marginTop: '50px' }}>
               Doctors
            </Typography>

            {filterDocLoading ? (
               <div style={{ height: '30%' }}>
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        alignContent: 'center',
                     }}
                  >
                     <CircularProgress />
                  </Box>
               </div>
            ) : (
               <>
                  {isError ? (
                     <div>Oops ! Something went Wrong</div>
                  ) : (
                     <Grid container spacing={6} style={{ marginTop: '20px' }}>
                        {allDoctor?.map((result, index) => {
                           let diseases = result?.disease_specialist || []
                           // let days = result?.day || [] // available days

                           return (
                              <Grid item xs={12} md={3} sm={6} key={index}>
                                 {/* here the redirection url is not defined when the page is complete than it work */}
                                 {/* <Link style={{textDecoration:'none'}} href=""> */}
                                 <Card sx={{ borderRadius: '5px' }}>
                                    <CardActionArea sx={{ minHeight: 285 }}>
                                       <CardContent>
                                          <Grid container>
                                             <Grid item>
                                                <Image
                                                   height={50}
                                                   width={50}
                                                   src='https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-doctor-icon-circle-png-image_2055257.jpg'
                                                />
                                             </Grid>
                                             <Grid item sx={{ paddingLeft: 2 }}>
                                                <Typography
                                                   variant='body2'
                                                   color={'#2CD9C5'}
                                                   sx={{ fontWeight: 700 }}
                                                >
                                                   Name
                                                </Typography>
                                                <Typography
                                                   gutterBottom
                                                   variant='h6'
                                                   component='div'
                                                >
                                                   Dr.{' '}
                                                   {result.employee.employee_name}
                                                </Typography>
                                             </Grid>
                                          </Grid>

                                          <Typography
                                             variant='body2'
                                             color='#2CD9C5'
                                             sx={{ fontWeight: 700, marginTop: 1.5 }}
                                          >
                                             Disease Specialist
                                          </Typography>
                                          <div style={{ marginBottom: 10 }}>
                                             {diseases?.map((item) => {
                                                return (
                                                   <Chip
                                                      key={item}
                                                      size='small'
                                                      label={item}
                                                      sx={{
                                                         marginRight: 1,
                                                         marginTop: 1,
                                                         backgroundColor:
                                                            '#2CD9C51A',
                                                      }}
                                                   />
                                                )
                                             })}
                                          </div>
                                          <div style={{ paddingTop: 10 }}>
                                             <Link
                                                href={`/bookappointment`}
                                                passHref
                                             >
                                                <Button
                                                   variant='contained'
                                                   size='small'
                                                >
                                                   Book Appointment
                                                </Button>
                                             </Link>
                                          </div>
                                       </CardContent>
                                    </CardActionArea>
                                 </Card>
                              </Grid>
                           )
                        })}
                     </Grid>
                  )}
               </>
            )}
         </Container>
      </div>
   )
}
export default DoctorPage
