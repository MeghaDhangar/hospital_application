import { Box, Typography, Button, Grid, Input } from '@mui/material'
import { Facebook, Instagram, Twitter } from '@mui/icons-material'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Image from 'next/image'
import { colors } from '../styles/theme'
import Logo from '../assets/footerimages/whiteSga.png'

const Footer = () => {
   return (
      <Grid
         className='main-body'
         // component="footer"
         sx={{
            background: colors.primary,
            p: { xs: 2, md: 4, lg: 0 },
            pt: { lg: 5 },
            mt: 10,
            pb: 8,
            fontSize: { xs: '12px', md: '14px' },
            position: 'relative',
            left: 0,
            bottom: 0,
            width: '100%',
         }}
      >
         <Container sx={{ margin: 'auto' }} maxWidth='lg'>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={3}>
                  <Typography sx={{ marginTop: 1, marginLeft: 0 }}>
                     <Image width={160} height={50} src={Logo} />
                  </Typography>
               </Grid>

               <Grid item xs={12} sm={3}>
                  <Typography
                     variant='body1'
                     color='white'
                     sx={{ padding: 1, fontWeight: 'bold' }}
                  >
                     Social Media
                  </Typography>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Centre for Transplant
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Critical Care Unit
                     </Typography>
                  </Link>
                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Department of Cardiology
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Department of Orthopedics
                     </Typography>
                  </Link>

                  <Link href='https://www.facebook.com' color='#FFFFFF'
                     sx={{ pl: 1, pr: 1 }}
                  >
                     <Facebook />

                  </Link>
                  <Link
                     href='https://www.instagram.com'
                     color='#FFFFFF'
                     sx={{ pl:0 , pr: 1 }}
                  >
                     <Instagram />
                  </Link>
                  <Link href='https://www.twitter.com' color='#FFFFFF'>
                     <Twitter />
                  </Link>
               </Grid>

               <Grid item xs={12} sm={3}>
                  <Typography
                     variant='body1'
                     color='white'
                     sx={{ padding: 1, fontWeight: 'bold' }}
                  >
                     Centres of Excellence
                  </Typography>

                  <Link href='/dashboard/neurosciences' passHref>
                     <Typography variant='body2' color='white' sx={{ padding: 1 }}>
                        Centre for Neurosciences
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Centre for Transplant
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Critical Care Unit
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Department of Cardiology
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Department of Orthopedics
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Gynaecology and Obstetrics
                     </Typography>
                  </Link>

                  <Link>
                     <Typography
                        variant='body2'
                        color='white'
                        sx={{
                           padding: 1,
                        }}
                     >
                        Pediatrics
                     </Typography>
                  </Link>
               </Grid>

               <Grid item xs={12} sm={3}>
                  <Typography
                     variant='body1'
                     color='white'
                     sx={{ padding: 1, fontWeight: 'bold' }}
                  >
                     Hospital Details
                  </Typography>
                 
                     <Typography variant='body2' color='white' sx={{ padding: 1 }}>
                        Contact Us
                     </Typography>
               
                  <Typography variant='body2' color='white' sx={{ padding: 1 }}>
                     <Input
                        varient='outline'
                        type='text'
                        placeholder='Enter your email'
                        sx={{
                           padding: 2,
                           width: '100%',
                           backgroundColor: 'white',
                           borderRadius: 3,
                           outline: 'none',
                           border: 'none',
                           height: 17,
                           margin: 1,
                           borderBottom: ' ipx solid transparent',
                           '&:focus': {
                              borderBottom: 'none',
                           },
                        }}
                     />
                     <Button
                        variant='contained'
                        sx={{
                           borderRadius: 3,
                           margin: '5px',
                           maxHeight: '2rem',
                           backgroundColor: '#35CFF4',
                           '&:hover': {
                              backgroundColor: '#35CFF4',
                           },
                        }}
                     >
                        Sign Up
                     </Button>
                  </Typography>
               </Grid>
            </Grid>
            <Box sx={{ marginLeft: 3 }}>
               <hr />
            </Box>

            <Typography
               variant='body2'
               color='white'
               sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding:1
               }}
            >
               &copy; {new Date().getFullYear()} Your Website Name
            </Typography>
         </Container>
      </Grid>
   )
}

export default Footer
