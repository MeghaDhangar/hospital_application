'use client'

// import ShowDoctors from './../../Pages/ShowDoctors'
import dynamic from 'next/dynamic'
// import CircularProgress from '@mui/material/CircularProgress';
import { Container } from '@mui/system';

const ShowDoctors = dynamic(() => import('@/Pages/ShowDoctors'), {
   loading: () => <Container  style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', 
    }} >Loading... </Container>,
   ssr:false
})
function DoctorPage() {
   return (
      <div>
         <ShowDoctors />
      </div>
   )
}

export default DoctorPage
