// import ViewAppoinment from './../../Pages/ViewAppointment'
import dynamic from 'next/dynamic'
import {Container} from '@mui/system'

const ViewAppoinment = dynamic(() => import('@/pages/ViewAppointment'), {
   loading: () => <Container  style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', 
    }} >Loading... </Container>,
   ssr:false
})
function Contact() {
   return (
      <div>
         <ViewAppoinment />
      </div>
   )
}

export default Contact
