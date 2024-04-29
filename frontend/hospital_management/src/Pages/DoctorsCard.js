
import { Grid, Card, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper/modules'
import Link from 'next/link'
import { useGetViewDoctorQuery } from '@/services/Query'
function DoctorCard() {
   const { data: getDname } = useGetViewDoctorQuery()
   const [screenSize, setScreenSize] = useState(getInitialScreenSize())

   useEffect(() => {
      const handleResize = () => {
         setScreenSize(getInitialScreenSize())
      }
      // Check if window is defined (i.e., we are in the browser)
      if (typeof window !== 'undefined') {
         // Attach the event listenerb
         window.addEventListener('resize', handleResize)
         // Detach the event listener on component unmount
         return () => {
            window.removeEventListener('resize', handleResize)
         }
      }
   }, [])
   function getInitialScreenSize() {
      // Check if window is defined (i.e., we are in the browser)
      if (typeof window !== 'undefined') {
         const width = window.innerWidth
         if (width <= 320) {
            return 1
         } else if (width <= 768) {
            return 2
         } else {
            return 3
         }
      }
   }

   // Rest of your code...
   const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesPerView: screenSize,
      spaceBetween: screenSize * 10,
   }
   return (
      <>
         <Typography
            variant='h3'
            align='center'
            color='primary'
            style={{ marginTop: '50px' }}
         >
            Doctors
         </Typography>
         <Container maxWidth='lg' sx={{ padding: '3rem' }}>
            <Swiper
               {...settings}
               pagination={{
                  clickable: true,
                  el: '.swiper-pagination-custom',
                  justifyContent: 'center',
               }}
               modules={[Pagination, Navigation]}
               className='mySwiper'
            >
               {getDname?.data?.results?.map((result) => (
                <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                key={result?.doctor_id}
              >
                     <SwiperSlide>
                        <Grid item sx={{ minWidth: 400 }} xs={12} md={4} sm={6}>
                           <Card
                              sx={{
                                 maxWidth: 350,
                                 border: '4 px solid',
                                 textAlign: 'center',
                              }}
                           >
                              <Image
                                 height={250}
                                 width={350}
                                 src={result.doctor_profile_picture}
                                 alt='image'
                              />
                              <Typography gutterBottom variant='h5' component='div' >
                                 
                                <Typography variant='body1'sx={{display:'inline', bgcolor:'#fff' ,position:"absolute",right:'80px',left:'80px',  bottom:"2rem", justifyContent:'center',borderRadius:1,boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',margin:1 }}>
                                {result?.disease_specialist[0]?.disease_name} 
                                 </Typography>
                                 
                                    
                                     {/* <Chip label={result.disease_specialist}  variant="contained" sx={{position:"absolute", right:"7rem",  bottom:"3rem" , backgroundColor: "white"}}/> */}
                                 
                                 Dr.{result.employee?.employee_name}
                                 <Typography variant='body2' color='text.secondary'paddingBottom={"3px"}>
                                    {result.category}
                                 </Typography>
                              </Typography>
                              <Link
                                 style={{ textDecoration: 'none' }}
                                 href='/doctorpage'
                              >
                                 {/* <Button
                                    sx={{
                                       border: '1px solid',
                                       '&:hover': {
                                          backgroundColor: '#13293D',
                                          color: '#fff', 
                                       },
                                    }}
                                 >
                                    Book Appointment
                                 </Button> */}
                              </Link>
                           </Card>
                        </Grid>
                     </SwiperSlide>
                  </Grid>
               ))}
            </Swiper>
            <div
               className='swiper-pagination-custom'
               style={{
                  marginTop: '30px',
                  display: 'flex',
                  justifyContent: 'center',
               }}
            ></div>
         </Container>
      </>
   )
}
export default DoctorCard
