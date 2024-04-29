


// import PatientProfile from './../../Pages/PatientProfile'
import dynamic from 'next/dynamic'
import {Container} from '@mui/system'
const PatientProfile = dynamic(() => import('@/pages/PatientProfile'), {
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
      <PatientProfile/>
    </div>
  )
}

export default page
