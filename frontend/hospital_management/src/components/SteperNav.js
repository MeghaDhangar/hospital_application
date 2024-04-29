
'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useUser } from '@auth0/nextjs-auth0/client'
import Logo from '../assets/navbarimages/whiteSga.png'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLoginUserMutation } from '@/services/Query'


const drawerWidth = 240
const navItems = [
   { label: 'Doctor', route: '/showdoctors' },
   { label: 'Book Appointment', route: '/doctorpage' },
   { label: 'View Appointment', route: '/viewappoinment' },
]

function SteperNav(props) {
   const { window } = props
   const [mobileOpen, setMobileOpen] = useState(false)
   const [userLogin] = useLoginUserMutation();
   const { user } = useUser()
   const [isLoading, setIsLoading] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);

   const handleDrawerToggle = () => {
      setMobileOpen((prevState) => !prevState)
   }

   

   const getNavigationItems = () => {
      const role = localStorage.getItem('user_role');    
      switch (role) {
        case 'Admin':
        case 'Manager':
          return (
            <>
              <Link href="/dashboard" prefetch>
                <Button sx={{ color: '#fff' }}>Dashboard</Button>
              </Link>
              {navItems.map((item) => (
                <Link key={item.label} href={item.route} prefetch passHref>
                  <Button sx={{ color: '#fff' }}>{item.label}</Button>
                </Link>
              ))}
              {user && (
                <Button
                  onClick={() => {
                    localStorage.clear();
                    let a = document.createElement('a');
                    a.href = '/api/auth/logout';
                    a.click();
                  }}
                  sx={{ color: '#fff' }}
                >
                  Logout
                </Button>
              )}
            </>
          );
    
        case 'Doctor':
          return (
            <>
              <Link href="/dashboard" prefetch>
                <Button sx={{ color: '#fff' }}>Dashboard</Button>
              </Link>
              {user && (
                <Button
                  onClick={() => {
                    localStorage.clear();
                    let a = document.createElement('a');
                    a.href = '/api/auth/logout';
                    a.click();
                  }}
                  sx={{ color: '#fff' }}
                >
                  Logout
                </Button>
              )}
            </>
          );
    
        case 'Patient':
          return (
            <>
              {navItems.map((item) => (
                <Link key={item.label} href={item.route} prefetch passHref>
                  <Button sx={{ color: '#fff' }}>{item.label}</Button>
                </Link>
              ))}
              {/* {user && (
                <Button sx={{ color: '#fff' }}>{user.name || 'User'}</Button>
              )} */}
              {user && (
                <Button
                  onClick={() => {
                    localStorage.clear();
                    let a = document.createElement('a');
                    a.href = '/api/auth/logout';
                    a.click();
                  }}
                  sx={{ color: '#fff' }}
                >
                  Logout
                </Button>
              )}
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
   useEffect(() => {
      if (user && !loggedIn) {
         setIsLoading(true); 
         const handleSubmit = async () => {
            try {
               let res = await userLogin(user.email).unwrap();
               localStorage.setItem('user_id', res.data.id);
               localStorage.setItem('access_token', res.data.token.access);
               localStorage.setItem('user_role', res.data.user_role);
               localStorage.setItem('refresh_token', res.data.token.refresh);
               setIsLoading(false); 
               setLoggedIn(true); 
            } catch (err) {
               setIsLoading(false); 
               console.warn(err);
            }
         };
         handleSubmit();
      }
   }, [user, loggedIn, userLogin]);
   
   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', color: '#fff' }}>
         <Divider />
         <List>
            {/* <Button href='/api/auth/login' sx={{ color: '#fff' }}>
               Login
            </Button> */}
            {navItems.map((item) => (
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
         <AppBar component='nav'>
            <Toolbar>
               <IconButton
                  color='#fff'
                  aria-label='open drawer'
                  edge='start'
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
               >
                  <MenuIcon />
               </IconButton>
               <Link href={'/'} prefetch style={{ display: 'flex', flexGrow: 1 }}>
                  <Image width={120} height={40} src={Logo} />
               </Link>

               <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {getNavigationItems()}
               </Box>
            </Toolbar>
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
      </div>
   );
}

export default SteperNav;