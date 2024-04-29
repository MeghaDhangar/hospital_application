'use client'
import { useState } from 'react'
import { Formik, Form, FieldArray, Field } from 'formik'
// import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import RadioButtonGroup from '@/components/RadioButton/RadioButtonGroup'
import DocUpdation from '@/components/FormValidation/DoctorUpdateValidation'
import { Box } from '@mui/material'
import { colors } from '@/styles/theme'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Image from 'next/image'
import { useDoctorUpdateMutation } from '@/services/Query'
import Text from '@/components/Textfield/Text'
import TimeText from '@/components/TimeTexts/TimeText'

const StyledPaper = styled(Paper)(({ theme }) => ({
   maxWidth: '950px',
   boxShadow: theme.shadows[3],
   backgroundColor: colors.background,
   borderRadius: '20px',
   padding: '2rem',
}))

//for the heading
const StyledTypography = styled(Typography)(() => ({
   fontWeight: 'bold',
   paddingBottom: '1rem',
   color: colors.primary,
}))

//for hiding the input image button
const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
   width: 1,
})

//for the whole form
const StyledFormWrapper = styled('div')({
   minHeight: '100vh',
   display: 'grid',
   placeItems: 'center',
   padding: '2rem',
   '@media (max-width: 450px)': {
      padding: '0rem',
   },
})

// for preview image
const StyledImageWrapper = styled(Image)(({ height, width }) => ({
   height: height || '100px',
   width: width || '100px',
   borderRadius: 10,
   border: `2px solid ${colors.secondary}`,
}))

// for the upload box and hover to show the animation of the upload icon
const StyledBox = styled(Box)(() => ({
   height: '150px',
   width: '150px',
   borderRadius: 10,
   backgroundColor: colors.lightGrey,
   border: `2px dashed ${colors.secondary}`,
   '&:hover': {
      cursor: 'pointer',
      border: `2px solid ${colors.secondary}`,
      transition: '3s ease-in-out',
   },
}))

console.log(StyledBox)
const INITIAL_FORM_STATE = {
   doctor_profile_picture: '',
   disease_specialist: '',
   times: [],
   Stimes: '',
   Etimes: '',
   day: '',
   per_patient_time: '',
   status: true,
}

const DocUpdate = () => {
   const [doctorUpdate] = useDoctorUpdateMutation()
   // const [file, setfile] = useState(null);

   const [previewImage, setPreviewImage] = useState(null) // actual image
   const [viewimage, setImage] = useState(null) // viewable image

   const handleImageChange = (event) => {
      const prev = event.target.files[0]
      if (prev) {
         const imageUrl = URL.createObjectURL(prev)
         setImage(imageUrl)
         setPreviewImage(prev)
      } else {
         setPreviewImage(null)
      }
   }

   const handleChooseLogoClick = () => {
      let fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.onchange = handleImageChange
      fileInput.click()
   }
   const handleRegister = async (values, { resetForm }) => {
      try {
         let res = await handleSubmit()
         await doctorUpdate({ ...values, hospital_logo: res.imageUrl })
         setPreviewImage('')
         setImage('')
         resetForm()
      } catch (error) {
         // Handle error
         // console.error('Error submitting form:', error);
      }
   }

   const handleSubmit = async () => {
      console.log('here ', previewImage)
      if (!previewImage) return
      const formdata = new FormData()
      formdata.append('file', previewImage)

      try {
         const response = await fetch('/api/s3-upload', {
            method: 'POST',
            body: formdata,
         })
         const data = await response.json()
         return data
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <StyledFormWrapper>
         <StyledPaper elevation={3}>
            <StyledTypography variant='h5' style={{ textAlign: 'center' }}>
               Doctor Updation Form
            </StyledTypography>
            <Formik
               initialValues={{
                  ...INITIAL_FORM_STATE,
               }}
               validationSchema={DocUpdation}
               // onSubmit={(values) => {
               //   console.log(values);
               // }}
               onSubmit={handleRegister}
            >
               {({ values, handleChange, handleBlur, touched }) => (
                  <Form>
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                           <Text
                              name='disease_specialist'
                              label='Diseases name'
                              autoComplete=''
                              InputProps={{
                                 style: {
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                 },
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                           <Text
                              name='day'
                              label='Available Days'
                              autoComplete='off'
                              InputProps={{
                                 style: {
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                 },
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                           <TimeText
                              name='per_patient_time'
                              label='Per Patient Time'
                              autoComplete='off'
                              InputProps={{
                                 style: {
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                 },
                              }}
                           />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                           <RadioButtonGroup
                              label='Status'
                              name='status'
                              options={[
                                 { value: true, label: 'Active' },
                                 { value: false, label: 'Inactive' },
                              ]}
                           />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6}>
                           <FieldArray
                              name='times'
                              render={(arrayHelpers) => (
                                 <>
                                    {values.times.map((time, index) => (
                                       <Grid item md={12}>
                                          <Grid
                                             item
                                             xs={12}
                                             sm={6}
                                             md={12}
                                             sx={{ marginBottom: 1, marginY: 2 }}
                                             key={index}
                                          >
                                             <Field
                                                name={'Stimes'}
                                                as={TimeText}
                                                label={` Start Time #${index + 1}`}
                                                autoComplete=''
                                                InputProps={{
                                                   style: {
                                                      background: 'white',
                                                      border: 'none',
                                                      borderRadius: '20px',
                                                   },
                                                }}
                                             />
                                          </Grid>
                                          <Grid
                                             item
                                             xs={12}
                                             sm={6}
                                             md={12}
                                             sx={{ marginBottom: 1, marginY: 2 }}
                                             key={index}
                                          >
                                             <Field
                                                name={'Etimes'}
                                                as={TimeText}
                                                label={` End Time #${index + 1}`}
                                                autoComplete=''
                                                InputProps={{
                                                   style: {
                                                      background: 'white',
                                                      border: 'none',
                                                      borderRadius: '20px',
                                                   },
                                                }}
                                             />
                                          </Grid>
                                       </Grid>
                                    ))}

                                    <Grid item xs={12} sm={6} md={6}>
                                       <Button
                                          variant='contained'
                                          size='large'
                                          color='primary'
                                          onClick={() =>
                                             arrayHelpers.push('00:00:00')
                                          }
                                       >
                                          +AddTime
                                       </Button>
                                    </Grid>
                                 </>
                              )}
                           />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                           <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                              Profile Picture
                           </Typography>
                           <Box
                              onClick={handleChooseLogoClick}
                              sx={{
                                 height: '150px',
                                 width: '150px',
                                 margin: '1rem 0rem',
                              }}
                           >
                              {previewImage ? (
                                 <StyledImageWrapper
                                    width={150}
                                    height={150}
                                    onClick={handleChooseLogoClick}
                                    src={viewimage}
                                    alt='logo'
                                 />
                              ) : (
                                 <StyledBox
                                    item
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='center'
                                 >
                                    <Grid display='block'>
                                       <CloudUploadIcon
                                          sx={{
                                             height: '35px',
                                             color: colors.secondary,
                                             position: 'relative',
                                             left: '2rem',
                                          }}
                                       />
                                       <StyledTypography variant='body2'>
                                          upload Picture
                                       </StyledTypography>
                                    </Grid>
                                 </StyledBox>
                              )}
                           </Box>
                        </Grid>

                        <Grid item xs={0} sm={5}>
                           <VisuallyHiddenInput
                              id='logoInput'
                              type='file'
                              accept='image/*'
                           />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                           <Button
                              container
                              justify='center'
                              alignItems='flex-end'
                              variant='contained'
                              color='primary'
                              type='submit'
                           >
                              Submit
                           </Button>
                        </Grid>
                     </Grid>
                  </Form>
               )}
            </Formik>
         </StyledPaper>
      </StyledFormWrapper>
   )
}

export default DocUpdate
