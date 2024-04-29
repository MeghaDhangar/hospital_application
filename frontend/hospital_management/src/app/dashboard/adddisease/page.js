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
   Switch,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import { CardContent } from '@mui/material'
import { Formik, Form } from 'formik'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
// import RadioButtonGroup from './../../../components/RadioButton/RadioButtonGroup'
// import DISEASE_VALIDATION from './../../../components/FormValidation/DiseaseValidation'
import Text from '@/components/Textfield/Text'
import { styled } from '@mui/material/styles'
import { colors } from '@/styles/theme'
import Divider from '@mui/material/Divider'
import { useAddDiseasesMutation } from '@/services/Query'
import { useGetAllDiseasesQuery } from '@/services/Query'
import CircularProgress from '@mui/material/CircularProgress'
import { useDiseaseStatusMutation } from '../../../services/Query'
import CardActions from '@mui/material/CardActions'
import dynamic from 'next/dynamic'


const RadioButtonGroup = dynamic(() => import('@/components/RadioButton/RadioButtonGroup'), {
   ssr:false
})

const DISEASE_VALIDATION = dynamic(() => import('@/components/FormValidation/DiseaseValidation'), {
   ssr:false
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
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const { data: getDisease, isLoading, refetch } = useGetAllDiseasesQuery()
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [updateStatus] = useDiseaseStatusMutation()
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [addDisease] = useAddDiseasesMutation()

   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [loading, setLoading] = useState(false)

   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [openModal, setOpenModal] = useState(false)
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [open, setOpen] = useState(false)
   // eslint-disable-next-line react-hooks/rules-of-hooks
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
     console.log(res)
         if(res.data.status === 200){
         toast.success(res?.data?.message || 'Disease added successfully')
         resetForm()
         }
         
      } catch (error) {
         toast.error("Disease already exist")
         // Handle error
         // console.error('Error submitting form:', error);
      }
   }

   // change status
   const ChangeStatus = async () => {
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

                  <Dialog
        fullWidth={true}
        maxWidth={'xs'}
        open={openModal}
      >
            <DialogTitle
              sx={{ m: 0, p: 2 }} id="customized-dialog-title"
            >
               Do you want to update status?
            </DialogTitle>
            <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
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
               <Button
                  disabled={loading}
                  onClick={ChangeStatus}
                  variant="contained"
                  color='primary'
                  className='Yes'
               >
                  {loading ? <CircularProgress size={20} /> : 'Yes'}
               </Button>
            </DialogActions>
         </Dialog>
         
         <Button onClick={handleOpen} variant='outlined'>
            Add Disease
         </Button>

         <Modal
            open={open}
            // onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
         >
            <Box sx={style}>
               <StyledFormWrapper>
                  <StyledPaper elevation={3}>
                     <Grid
                        container
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                     >
                        <Typography variant='h5' gutterBottom>
                           Add Disease
                        </Typography>
                        <IconButton
                           aria-label='close'
                           onClick={handleClose}
                           sx={{
                              position: 'absolute',
                              right: 8,
                              top: 10,
                              color: (theme) => theme.palette.grey[500],
                           }}
                        >
                           <CloseIcon />
                        </IconButton>
                     </Grid>
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
                                       sx={{
                                          position: 'absolute',
                                          right: 7,
                                          bottom: 7,
                                       }}
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

         <Grid container spacing={2} style={{ marginTop: 0.8 }}>
            {getDisease?.data?.map((e, i) => {
               return (
                  <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                     <Card>
                        <CardContent>
                           <Typography gutterBottom variant='h5' component='div'>
                              {e?.disease_name}
                           </Typography>
                        </CardContent>
                        <CardActions>
                           <Switch
                              checked={e?.disease_status}
                              onClick={() => {
                                 setDisease(e)
                                 setOpenModal(true)
                              }}
                              color='primary'
                              size='small'
                           />
                           <Typography variant='body2' color='text.secondary'>
                              {e?.disease_status ? 'Active' : 'Inactive'}
                           </Typography>
                        </CardActions>
                     </Card>
                  </Grid>
               )
            })}
         </Grid>
      </div>
   )
}

export default page
