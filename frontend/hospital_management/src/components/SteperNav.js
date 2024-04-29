
'use client'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import manager from './../assets/manager.png'
import patient from './../assets/patient.png'
import docter from './../assets/doctorr.png'
import Logo from '../assets/navbarimages/whiteSga.png'
import { useUser } from '@auth0/nextjs-auth0/client'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useGetRefreshTokenQuery, useLoginUserMutation } from '@/services/Query'
import { useRouter } from 'next/navigation';

const drawerWidth = 240
const pages = [{ label: 'Doctor', route: '/showdoctors' },
{ label: 'Book Appointment', route: '/doctorpage' },
{ label: 'View Appointment', route: '/viewappoinment' },];


function ResponsiveAppBar(props) {

   //eslint-disable-next-line
   let isLogin = localStorage.getItem('isLogin');
   const navigate = useRouter();
   const { window } = props
   const [mobileOpen, setMobileOpen] = useState(false)
   const [userLogin] = useLoginUserMutation();
   const { user = false } = useUser()

   let t1 = localStorage.getItem('refresh_token')
   const { data: refreshToken, isSuccess, isFeching } = useGetRefreshTokenQuery(t1, {
      skip: !user || !t1,
      pollingInterval: 60000 * 5,

   })

   const updateData = () => {
      if (refreshToken) {
         localStorage.setItem('refresh_token', refreshToken.refresh)
         localStorage.setItem('access_token', refreshToken.access)
      }
   }

   React.useEffect(() => {
      if (isSuccess && refreshToken) {
         updateData()
      }
   }, [isSuccess, isFeching, refreshToken])

   const [isLoading, setIsLoading] = useState(false);
   const [loggedIn, setLoggedIn] = useState(isLogin ? true : false);
   // eslint-disable-next-line no-unused-vars
   const [, setAnchorElNav] = React.useState(null);
   const [anchorElUser, setAnchorElUser] = React.useState(null);

   const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
   };
   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
   };


   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };

   const handleDrawerToggle = () => {
      setMobileOpen((prevState) => !prevState)
   }


   const getUserSettings = () => {
      const settings = [];
      const userRole = localStorage.getItem('user_role');

      switch (userRole) {
         case 'Patient':
            settings.push({ label: 'Profile', route: '/patientprofile' });
            break;
         default:
            break;
      }

      return settings;
   };
   const settings = getUserSettings();

   const getNavigationItems = () => {
      //eslint-disable-next-line
      const role = localStorage.getItem('user_role');
      switch (role) {
         case 'Admin':
         case 'Manager':
            return (
               <>
                  <Link href="/dashboard" prefetch>
                     <Button sx={{ color: '#fff' }}>Dashboard</Button>
                  </Link>
                  {pages.map((item) => (
                     <Link key={item.label} href={item.route} prefetch passHref>
                        <Button sx={{ color: '#fff' }}>{item.label}</Button>
                     </Link>
                  ))}
               </>
            );

         case 'Doctor':
            return (
               <>
                  <Link href="/dashboard" prefetch>
                     <Button sx={{ color: '#fff' }}>Dashboard</Button>
                  </Link>

               </>
            );

         case 'Patient':
            return (
               <>
                  {pages.map((item) => (
                     <Link key={item.label} href={item.route} prefetch passHref>
                        <Button sx={{ color: '#fff' }}>{item.label}</Button>
                     </Link>
                  ))}

               </>
            );

         default:
            return (
               <Link href="/api/auth/login" passHref>
                  <Button sx={{ color: '#fff' }}>Login</Button>
               </Link>
            );
      }
   };

   const getUserImage = () => {
      //eslint-disable-next-line
      const userRole = localStorage.getItem('user_role');

      switch (userRole) {
         case 'Admin':
         case 'Manager':
            return <Image alt="Admin" height="35" width="35" decoding="async" src={manager} />;
         case 'Doctor':
            return <Image alt="Doctor" height="35" width="35" decoding="async" src={docter} />;
         case 'Patient':
            return <Image alt="Patient" height="35" width="35" decoding="async" src={patient} />
         default:
            return null;
      }
   };

   useEffect(() => {
      if (user && !loggedIn) {
         setIsLoading(true);
         const handleSubmit = async () => {
            try {
               let res = await userLogin(user.email).unwrap();

               localStorage.setItem('user_name', user.name);
               localStorage.setItem('user_id', res.data.id);
               localStorage.setItem('access_token', res.data.token.access);
               localStorage.setItem('user_role', res.data.user_role);
               localStorage.setItem('refresh_token', res.data.token.refresh);
               localStorage.setItem('isLogin', true);

               if (res.data.user_role !== 'Patient') {
                  // redirect to dashboard
                  navigate.push('/dashboard');
               }
               setTimeout(() => {
                  setIsLoading(false);
                  setLoggedIn(true);
               }, 2000)

            } catch (err) {
               setIsLoading(false);
               console.warn(err);
            }
         };
         handleSubmit();
      }
   }, [user, loggedIn, userLogin, isLogin, navigate]);

   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', color: '#fff' }}>
         <Divider />
         <List>
            {pages.map((item) => (
               <ListItem key={item.label} disablePadding>
                  <ListItemButton sx={{ textAlign: 'center' }}>
                     <Link href={item.route} passHref>
                        <ListItemText
                           primary={item.label}
                           primaryTypographyProps={{
                              variant: 'body2',
                              fontSize: '12px',
                           }}
                        />
                     </Link>
                  </ListItemButton>
               </ListItem>
            ))}
         </List>
      </Box>
   )

   const container = window !== undefined ? () => window().document.body : undefined
   return (
      <div>
         <CssBaseline />
         <AppBar position="fixed">
            <Container maxWidth="xl">
               <Toolbar disableGutters>
                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                     <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                     >
                        <MenuIcon />
                     </IconButton>

                  </Box>
                  <Link href={'/'} prefetch style={{ display: 'flex', flexGrow: 1 }}>
                     <Image width={120} height={40} src={Logo} />
                  </Link>

                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', fontSize: '15px' }}>
                     {getNavigationItems()}
                  </Box>

                  <Box sx={{ flexGrow: 0 }}>
                     <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {getUserImage()}
                     </IconButton>
                     <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                     >
                        {settings.map((setting) => (
                           <MenuItem key={setting.label}>
                              <Link href={setting.route} style={{ textDecoration: 'none', color: 'inherit' }} prefetch>
                                 <Typography component='a' textAlign='center'  >
                                    {setting.label}
                                 </Typography>
                              </Link>
                           </MenuItem>
                        ))}
                        {/* {['Admin', 'Doctor', 'Patient'].includes(localStorage.getItem('user_role')) && user && ( */}
                        <MenuItem
                           onClick={() => {
                              localStorage.clear();
                              const a = document.createElement('a');
                              a.href = '/api/auth/logout';
                              a.click();
                           }}
                        >
                           <Typography textAlign='center'>Logout</Typography>
                        </MenuItem>
                        {/* )} */}
                     </Menu>
                  </Box>
               </Toolbar>

               {isLoading && (
                  <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                     <CircularProgress color="inherit" />
                     <Typography variant="subtitle1" style={{ marginTop: '10px', color: '#fff' }}>
                        Checking authentication...
                     </Typography>
                  </Backdrop>
               )}

            </Container>
         </AppBar>

         <nav>
            <Drawer
               container={container}
               variant='temporary'
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{
                  keepMounted: true,
               }}
               sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': {
                     boxSizing: 'border-box',
                     width: drawerWidth,
                  },
               }}
            >
               {drawer}
            </Drawer>
         </nav>
         <Box component='main'>
            <Toolbar />
            <Typography></Typography>
         </Box>

      </div >
   );
}
export default ResponsiveAppBar;