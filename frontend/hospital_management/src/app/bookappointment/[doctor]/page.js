'use client'

// import BookAppoinment from './../../Pages/BookAppointment'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import {Container} from '@mui/system'

const BookAppoinment = dynamic(() => import('@/Pages/BookAppointment'), {
   loading: () => <Container  style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', 
    }} >Loading... </Container>,
   ssr:false
})
const page = () => {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const info = useParams()
   const [id, date, ...rest] = info.doctor.split('%')
   const name = rest.join(' ').trim()
   let newData = date.replace(/2B/g, '')
   let r1 = name.replace(/20|2B/g, ' ')

   return (
      <div>
         <BookAppoinment id={id} name={r1} date={newData} />
      </div>
   )
}

export default page
