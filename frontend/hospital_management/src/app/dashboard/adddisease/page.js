'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import {
   Card,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Skeleton,
   IconButton,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import { CardActionArea } from '@mui/material'
import { CardContent } from '@mui/material'
import { Formik, Form } from 'formik'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
import RadioButtonGroup from '@/components/RadioButton/RadioButtonGroup'
import DISEASE_VALIDATION from '@/components/FormValidation/DiseaseValidation'
import Text from '@/components/Textfield/Text'
import { styled } from '@mui/material/styles'
import { colors } from '@/styles/theme'
import Divider from '@mui/material/Divider'
import { useAddDiseasesMutation } from '@/services/Query'
import { useGetAllDiseasesQuery } from '@/services/Query'
import CircularProgress from '@mui/material/CircularProgress'
import CoronavirusTwoToneIcon from '@mui/icons-material/CoronavirusTwoTone'
import { alpha } from '@mui/material/styles'
import { green } from '@mui/material/colors'
import Switch from '@mui/material/Switch'
import { useDiseaseStatusMutation } from '../../../services/Query'
import { positions } from '@mui/system'

const GreenSwitch = styled(Switch)(({ theme }) => ({
   '& .MuiSwitch-switchBase.Mui-checked': {
      color: green[600],
      '&:hover': {
         backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
   },
   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: green[600],
   },
}))

const label = { inputProps: { 'aria-label': 'Color switch demo' } }

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
   //  maxWidth: '950px',
   boxShadow: theme.shadows[3],
   backgroundColor: colors.background,
   borderRadius: '20px',
   padding: '2rem',
   width: '600',
   minWidth: 240,
}))

//for the heading
const StyledTypography = styled(Typography)(() => ({
   fontWeight: 'bold',
   //  paddingBottom: '1rem',
   color: colors.primary,
}))

//for hiding the input image button

//for the whole form
const StyledFormWrapper = styled('div')({
   marginTop: '-12.5px',
   display: 'grid',
   placeItems: 'center',
   // padding: '2rem',
   '@media (max-width: 450px)': {
      padding: '0rem',
   },
})

const INITIAL_FORM_STATE = {
   // disease_id: '',
   disease_name: '',
   disease_status: true,
   created_by: 'admin',
}

const page = () => {
   const { data: getDisease, isLoading, refetch } = useGetAllDiseasesQuery()
   const [updateStatus] = useDiseaseStatusMutation()
   const [addDisease] = useAddDiseasesMutation()

   const [loading, setLoading] = useState(false)

   const [openModal, setOpenModal] = useState(false)
   const [open, setOpen] = useState(false)
   const [disease, setDisease] = useState()

   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)

   const handleCloseModal = () => {
      setOpenModal(false)
   }

   const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      padding: 0,
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: '20px',
   }

   // add disease
   const handleRegister = async (values, { resetForm }) => {
      try {
         let res = await addDisease(values)
         toast.success(res?.data?.message || 'Disease added successfully')
         resetForm()
      } catch (error) {
         // Handle error
         // console.error('Error submitting form:', error);
      }
   }

   // change status
   const ChangeStatus = async (isSubmitting) => {
      try {
         setLoading((prev) => !prev)
         // Assuming your API expects an employee ID for deletion
         const result = await updateStatus(disease)
         refetch()

         setLoading((prev) => !prev)

         // Log the result to the console
         console.log('Result of updateStatus mutation:', result)
         handleCloseModal()
         // Perform any additional logic after successful deletion
      } catch (error) {
         // Handle error
         console.error('Error changing status:', error)
      }
   }

   return (
      <div>
         <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle
               style={{
                  border: '1px solid white',
                  borderRadius: '10px',
                  boxShadow: 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px',
                  fontWeight: 'bolder',
                  fontSize: '1rem',
               }}
            >
               Do you want?
            </DialogTitle>
            <Divider variant='middle' />
            <DialogContent>
               <p>
                  Change the status of
                  <span className='Data'>
                     {' '}
                     <b> {disease?.disease_name}</b>
                  </span>
               </p>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseModal} color='primary' className='No'>
                  No
               </Button>
               <Button disabled={loading} onClick={ChangeStatus} color='primary' className='Yes'>
                  {loading ? <CircularProgress size={20} /> : 'Yes'}
               </Button>
            </DialogActions>
         </Dialog>
         <Button onClick={handleOpen} variant='outlined'>
            Add Disease +
         </Button>

         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <StyledFormWrapper>
                  <IconButton
                     aria-label='close'
                     onClick={handleClose}
                     sx={{
                        position: 'absolute',
                        right: 3,
                        top: -5,
                        color: (theme) => theme.palette.grey[500],
                        // margin: 3
                     }}
                  >
                     <CloseIcon />
                  </IconButton>
                  <StyledPaper elevation={3}>
                     <Formik
                        initialValues={{
                           ...INITIAL_FORM_STATE,
                        }}
                        validationSchema={DISEASE_VALIDATION}
                        onSubmit={handleRegister}
                     >
                        {({ errors, isSubmitting }) => (
                           <Form>
                              {console.log(errors, 'here')}
                              <h2 style={{ marginTop: 0 }}>Add Disease</h2>

                              <Grid container spacing={2}>
                                 <Grid item xs={12}>
                                    <Text
                                       name='disease_name'
                                       label='Disease Name'
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
                                 <Grid item xs={12}>
                                    <RadioButtonGroup
                                       label='Disease Status'
                                       name='disease_status'
                                       options={[
                                          { value: 'true', label: 'Active' },
                                          { value: 'false', label: 'Inactive' },
                                       ]}
                                    />
                                 </Grid>
                                 <Divider />

                             

                                 <Grid item xs={12} sm={6}>
                                    <Button
                                       variant='contained'
                                       color='primary'
                                       type='submit'
                                       size='large'
                                       disabled={isSubmitting}
                                        sx={{position:'absolute', right:7 ,bottom:7}}
                                   
                                    >
                                       {isSubmitting ? 'Submitting...' : 'Submit'}
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

         {isLoading && (
            <>
               <Grid container alignItems='center' spacing={2} p={2}>
                  {Array.from({ length: 8 }).map((_, i) => (
                     <>
                        <Grid container item key={i} xs={12} sm={6} md={4} lg={3}>
                           <Grid item>
                              <Skeleton variant='rect' width={50} height={50} />
                           </Grid>
                           <Grid item sx={{ paddingLeft: 2, flex: 1 }}>
                              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                 <Skeleton width={120} />
                              </Typography>
                              <Typography gutterBottom variant='h6' component='div'>
                                 <Skeleton height={50} width={50} />
                              </Typography>
                           </Grid>
                        </Grid>
                     </>
                  ))}
               </Grid>
            </>
         )}

         <Grid container spacing={5} style={{ marginTop: 0.8 }}>
            {getDisease?.data?.map((e, i) => {
               let status = e.disease_status
               return (
                  <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                     <Card sx={{ maxWidth: 250 }}>
                        <CardContent>
                           <div style={{ display: 'flex' }}>
                              <div>
                                 <Typography sx={{ paddingTop: 0.3 }}>
                                    <CoronavirusTwoToneIcon />
                                 </Typography>
                              </div>
                              <div>
                                 <Typography
                                    gutterBottom
                                    variant='h6'
                                    component='div'
                                 >
                                    {e.disease_name}
                                 </Typography>
                              </div>
                           </div>
                           <div style={{ display: 'block' }}>
                              <Typography sx={{ paddingTop: 1, color: 'primary' }}>
                                 Status
                              </Typography>

                              {/* <GreenSwitch {...label} defaultChecked /> */}
                              {/* toggle code///////////////////////////////////////////////////////////////////////////////////////// */}

                              <div
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    alignItems: 'left',
                                 }}
                              >
                                 <Switch
                                    checked={status}
                                    onClick={() => {
                                       setDisease(e)
                                       setOpenModal(true)
                                    }}
                                    color='primary'
                                    size='small'
                                 />
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </Grid>
               )
            })}
         </Grid>
      </div>
   )
}

export default page
