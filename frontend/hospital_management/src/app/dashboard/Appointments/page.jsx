
"use client"
import { useRouter } from 'next/navigation'
// import { useParams } from 'next/navigation'
function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router=useRouter()
  const {patient_id} = router.query()
  console.log(patient_id)
  return (
    <div>
<h1>hiiiiiiiiiiiiiii</h1>
    </div>
  )
}

export default page