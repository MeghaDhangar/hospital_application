'use client'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ResponsiveAppBar from '@/components/Navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Toolbar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import MedicationIcon from '@mui/icons-material/Medication'
import CoronavirusIcon from '@mui/icons-material/Coronavirus'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { Container } from '@mui/system'
import withRoleRedirect from '@/helpers/withRoleRedirect'
import Footer from '../../components/Footer'
const drawerWidth = 240

const openedMixin = (theme) => ({
   width: drawerWidth,
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
   }),
   overflowX: 'hidden',
})

const closedMixin = (theme) => ({
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   overflowX: 'hidden',
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
   },
})

const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'flex-end',
   padding: theme.spacing(0, 1),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
   shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}))

const Drawer = styled(MuiDrawer, {
   shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
   width: drawerWidth,
   flexShrink: 0,
   whiteSpace: 'nowrap',
   boxSizing: 'border-box',
   ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
   }),
   ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
   }),
}))

const INITIAL_FORM_STATE = {
   employee_name: '',
   employee_email: '',
   employee_number: '',
   employee_password: '', // not available
   employee_type: '',
   employee_role: '',
   employee_status: '',
   created_by: 'admin',
   updated_by: 'admin',
}

function Layout({ children }) {
   const pathname = usePathname()

   const [open, setOpen] = React.useState(true)
   const sidebarChanges = () => {
      setOpen(!open)
   }

   // for disable and active style
   let disableStyle = {
      display: 'block',
      backgroundColor: '#13293d',
      '& .MuiListItemIcon-root': {
         color: '#FFFFFF',
      },
      '& .MuiListItemText-root': {
         color: '#FFFFFF',
      },
      '&:hover': {
         backgroundColor: '#FFFFFF',
         borderRadius: '15px',
         color: '#13293d',
         outline: 'none',
         '& .MuiListItemText-root': {
            color: '#000',
         },
         '& .MuiListItemIcon-root': {
            color: '#000',
         },
      },
   }

   let activeStyle = {
      display: 'block',
      borderRadius: '15px',
      // backgroundColor: "#fff",
      border: '1px solid #FFFFFF',
      color: '#FFFFFF',
      '& .MuiListItemIcon-root': {
         color: '#fff',
      },
      '& .MuiListItemText-root': {
         color: '#fff',
      },
      '&:hover': {
         backgroundColor: '#ffffff',
         color: '#000',
         borderRadius: '15px',
         outline: 'none',
         '& .MuiListItemIcon-root': {
            color: '#000',
         },
         '& .MuiListItemText-root': {
            color: '#000',
         },
      },
   }

   const getStyle = (path) => {
      if (path === pathname.toLowerCase()) {
         return activeStyle
      } else {
         return disableStyle
      }
   }


   let userRole = localStorage.getItem('user_role')
   let isAdmin = userRole === 'Admin' || userRole === 'Manager' ? true : false;



   return (
      <Box sx={{ display: 'flex' }}>
         <CssBaseline />
         <AppBar position='fixed' open={false} elevation={1}>
            <ResponsiveAppBar sidebarChanges={sidebarChanges} open={open} />
         </AppBar>
         <Drawer variant='permanent' open={open}>
            <div style={{ padding: '0.5rem' }}>
               <DrawerHeader></DrawerHeader>
               <List>
                  {[
                     { text: 'Home', path: '/', icon: <HomeIcon /> },
                     {
                        text: 'Dashboard',
                        path: '/dashboard',
                        icon: <DashboardIcon />,
                     },
                     {
                        text: 'Employee',
                        path: '/dashboard/employeedata',
                        icon: <TrackChangesIcon />,
                     },
                     // {
                     //    text: 'Add Doctor',
                     //    path: '/dashboard/adddoctor',
                     //    icon: <SettingsAccessibilityIcon />,
                     // },
                     {
                        text: 'Add Disease',
                        path: '/dashboard/adddisease',
                        icon: <CoronavirusIcon />,
                     },
         
                     {
                        text: 'Prescription',
                        path: '/dashboard/precription',
                        icon: <MedicationIcon />,
                     },
                  ].map((item , index) => {
                     if ( index >= 2 && !isAdmin) return null;
                  return (
                     <ListItem
                        key={item.text}
                        disablePadding
                        sx={{
                           ...getStyle(item.path),
                        }}
                     >
                        {/* Wrap the ListItemButton with Link */}
                        <Link
                           style={{
                              textDecoration: 'none',
                           }}
                           prefetch={true}
                           href={item.path}
                        >
                           <ListItemButton
                              component='a'
                              sx={{
                                 justifyContent: open ? 'initial' : 'center',
                              }}
                           >
                              <ListItemIcon
                                 sx={{
                                    justifyContent: 'center',
                                 }}
                              >
                                 {item.icon}
                              </ListItemIcon>
                              <ListItemText
                                 primary={item.text}
                                 sx={{ opacity: open ? 1 : 0 }}
                              />
                           </ListItemButton>
                        </Link>
                     </ListItem>
                  )}  
                  )}
               </List>
            </div>
         </Drawer>

         {/* <Box maxWidth={'100%'}> */}
         <Box
            component='main'
            sx={{
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               p: 3,
            }}
         >
            <Toolbar />
            <Container>{children}</Container>
         </Box>
      </Box>
      // </Box>
   )
}

export default withRoleRedirect(Layout, ['Admin', 'Manager', 'Doctor'])







