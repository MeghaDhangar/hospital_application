'use client'

import BookAppoinment from '@/Pages/BookAppointment'
import { useParams } from 'next/navigation'

const page = () => {
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
