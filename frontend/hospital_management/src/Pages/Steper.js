// import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import style from '@/styles/swiper.module.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Box from '@mui/material/Box'
// import './styles.css';
import { Pagination } from 'swiper/modules'
import { Typography } from '@mui/material'

const images = [
   {
      imgPath:
         'https://img.freepik.com/premium-photo/doctor-hold-icon-health-electronic-medical-record-interface-digital-healthcare-network_34200-712.jpg?w=1380',
   },

   {
      imgPath:
         'https://images.unsplash.com/photo-1624343285636-aba82fd5a124?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   },
   {
      imgPath:
         'https://img.freepik.com/premium-photo/modern-commercial-architecture-glass-steel-forum-skyscraper-reflecting-blue-sky_250132-16918.jpg?w=1060',
   },
]
function SwipeableTextMobileStepper() {
   return (
      <Swiper
         pagination={{
            dynamicBullets: true,
         }}
         modules={[Pagination]}
         className='mySwiper'
      >
         <Box>
            {images.map((image, index) => (
               <SwiperSlide key={index} className={style.swiperSlide}>
                  <img
                     src={image.imgPath}
                     alt={`slide-${index}`}
                     className='border p-1'
                  />
                  {index === 0 && (
                     <div className={style.textOverImage}>
                        <Typography variant='h3'>
                           {' '}
                           SGA Hospital Now in Sandalpur
                        </Typography>
                        <Typography variant={'body2'}>
                           CARE Hospitals expands its national footprint with the
                           acquisition of SGA Hospital,Sandalpur{' '}
                        </Typography>
                     </div>
                  )}
               </SwiperSlide>
            ))}
         </Box>
      </Swiper>
   )
}
export default SwipeableTextMobileStepper
