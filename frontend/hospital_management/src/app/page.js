'use client'
import FixedContainer from '@/Pages/container'
import { Grid } from '@mui/material'
import SwipeableTextMobileStepper from '@/Pages/Steper'
import DoctorCard from '@/Pages/DoctorsCard'
import DiseaseCards from '@/Pages/DiseaseCard'
import 'react-toastify/dist/ReactToastify.css'
import Cards from '@/Pages/Card'

function page() {
   return (
      <div>
         <SwipeableTextMobileStepper />
         <Grid container item>
            <FixedContainer />
         </Grid>
         <Cards />
         <DiseaseCards />
         <DoctorCard />
      </div>
   )
}
export default page
