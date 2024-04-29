// import DoctorPage from './../../Pages/DoctorPage'
import dynamic from 'next/dynamic'
import {Container} from '@mui/system'

const DoctorPage = dynamic(() => import('@/pages/DoctorPage'), {
   loading: () => <Container  style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', 
    }} >Loading... </Container>,
   ssr:false
})
function page() {
   return (
      <div>
         <DoctorPage />
      </div>
   )
}

export default page
