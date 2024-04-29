

"use client"
// import  DoctorProfile from '../../../Pages/Profile'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Container } from '@mui/system';

const DoctorProfile = dynamic(() => import('../../../Pages/Profile'), {
  loading: () => <Container  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', 
  }} >Loading... </Container>,
   ssr:false
})
function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {doc_id} = useParams()
  return (
    <div>
      <DoctorProfile id={doc_id} />
    </div>
  )
}

export default page