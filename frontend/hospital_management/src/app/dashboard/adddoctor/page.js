'use client'
import { Formik, Form } from 'formik'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
// import RadioButtonGroup from '../../../components/RadioButton/RadioButtonGroup'
// import DOCTOR_VALIDATION from '../../../components/FormValidation/DoctorValidation'
import Text from '@/components/Textfield/Text'
import { colors } from '@/styles/theme'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import * as React from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'


const RadioButtonGroup = dynamic(() => import('../../../components/RadioButton/RadioButtonGroup'), {
   ssr:false
})
const DOCTOR_VALIDATION = dynamic(() => import('../../../components/FormValidation/DoctorValidation'), {
   ssr:false
})




const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',

   boxShadow: 24,
}

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
const StyledPaper = styled(Paper)(({ theme }) => ({
   maxWidth: '650px',
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

const StyledFormWrapper = styled('div')({
   minHeight: '100%',
   display: 'grid',
   placeItems: 'center',
   padding: '2rem',
   '@media (max-width: 450px)': {
      padding: '0rem',
   },
})

const INITIAL_FORM_STATE = {
   // doc_Id: '',
   disease_Specialist: '',
   doc_Type: '',
   // Created_At: '',
   // Updated_At: '',
}


const AddDoctor = () => {
   const [open, setOpen] = React.useState(false)
   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)

   return (
      <div>
         <Grid container justifyContent={"space-around"}>
            <Grid item xs={11} sm={2} md={3}>
               <Typography>Doctor Information</Typography>
            </Grid>
            <Grid item xs={1} sm={2} md={3}>
            <Button onClick={handleOpen}>Add Doctor +</Button>
         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <StyledFormWrapper>
                  <StyledPaper elevation={3}>
                     <StyledTypography variant='h4'>
                        Doctor Registration Form
                     </StyledTypography>

                     <Formik
                        initialValues={{
                           ...INITIAL_FORM_STATE,
                        }}
                        validationSchema={DOCTOR_VALIDATION}
                        onSubmit={(values) => {
                           console.log(values)
                        }}
                     >
                        {() => (
                           <Form>
                              <Grid container spacing={2}>
                                 {/* <Grid item xs={12} sm={12}>
                                    <Text
                                       name='doc_Id'
                                       label='Doctor Id'
                                       autoComplete=''
                                       defaultValue='Id'
                                       InputProps={{
                                          style: {
                                             background: 'white',
                                             border: 'none',
                                             borderRadius: '20px',
                                          },
                                          readOnly: true,
                                       }}
                                    />
                                 </Grid> */}
                                 <Grid item xs={12} sm={6}>
                                    <Text
                                       name='disease_Specialist'
                                       label='Disease Specialist'
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
                                    <RadioButtonGroup
                                       label='Doctor Type'
                                       name='doc_Type'
                                       options={[
                                          { value: 'Active', label: 'Active' },
                                          { value: 'Inactive', label: 'Inactive' },
                                       ]}
                                    />
                                 </Grid>
                                 <Divider />
                                 {/* <Grid item xs={12} sm={6}>
                                    <Text
                                       name='Created_At'
                                       label='Created At'
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
                                       name='Updated_At'
                                       label='Updated At'
                                       autoComplete=''
                                       InputProps={{
                                          style: {
                                             background: 'white',
                                             border: 'none',
                                             borderRadius: '20px',
                                          },
                                       }}
                                    />
                                 </Grid> */}
                                 <Grid item xs={12} sm={5}>
                                    <VisuallyHiddenInput
                                       id='logoInput'
                                       type='file'
                                       accept='image/*'
                                    />
                                 </Grid>
                                 <Grid item xs={12} sm={6}>
                                    <Button
                                       variant='contained'
                                       color='primary'
                                       type='submit'
                                       size='large'
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
            </Box>
         </Modal>
            </Grid>
         </Grid>
        
      </div>
   )
}

export default AddDoctor
