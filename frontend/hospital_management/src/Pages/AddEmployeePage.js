'use client'
import { useState } from 'react'
import DataGridTable from './DataGridTable'
import { useGetEmployeeQuery } from '@/services/Query'
import { columns } from '@/data/EmployeeTableData'
import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   IconButton,
} from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Grid from '@mui/system/Unstable_Grid/Grid'
import { Formik, Form } from 'formik'
import { styled } from '@mui/material/styles'
import RadioButtonGroup from '@/components/RadioButton/RadioButtonGroup'
import CustomAutocomplete from '@/components/Autocomplete/index'
import Divider from '@mui/material/Divider'
import Text from '@/components/Textfield/Text'
import { useParams } from 'next/navigation'
import Paper from '@mui/material/Paper'
import FORM_VALIDATION from '@/components/FormValidation/EmployeeValidation'
import { Color } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAddEmployeeMutation } from '@/services/Query'

import { toast } from 'react-toastify'

const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 700,
   height: 400,
   bgcolor: 'background.paper',
   border: '2px solid #000',
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
   backgroundColor: 'primary',
   borderRadius: '20px',
   padding: '2rem',
}))

//for the heading
const StyledTypography = styled(Typography)(() => ({
   fontWeight: 'bold',
   paddingBottom: '1rem',
   color: colors.primary,
}))

//for the whole form
const StyledFormWrapper = styled('div')({
   minHeight: '100vh',
   display: 'grid',
   placeItems: 'center',
   // padding: '2rem',
   '@media (max-width: 450px)': {
      padding: '0rem',
   },
})

const INITIAL_FORM_STATE = {
   employee_name: '',
   employee_email: '',
   employee_number: '',
   employee_password: '', // not available
   employee_type: '',
   employee_role: '',
   employee_status: true,
}
const Empcategories = ['Part Time', 'Full Time']
const Role = ['Doctor', 'Manager']

function Dashboard() {
   const [addemployee] = useAddEmployeeMutation()

   const handleRegister = async (values, { resetForm }) => {
      try {
         let res = await addemployee(values)

       
   
         // toast.success(res?.data?.message || ' Employee added successfully')
         // resetForm()
         if (res.data && res.data.status == 200) {
            console.log("Its working")
            toast.success(res.data.message || 'Employee added successfully');
            resetForm();
          } else if(res) {
            toast.warn(res.error.message || 'Already exists');
            resetForm();
          }
      } catch (error) {
         // Handle error
         // console.error('Error submitting form:', error);
         console.error('Error submitting form:', error);
         toast.error('An error occurred while submitting the form');
      }
   }

   const [pageState, setPageState] = useState({
      isLoding: false,
      data: [],
      total: 0,
      page: 1,
      pageSize: 5,
   })
   const { data: empData, isFetching: loadinData } = useGetEmployeeQuery(pageState, {
      refetchOnMountOrArgChange: true,
   })
   const [open, setOpen] = useState(false)

   const handleClickOpen = () => {
      setOpen(true)
   }

   const handleClose = () => {
      setOpen(false)
   }

   return (
      <div>
         <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
         >
            {/* <Typography variant='h4' component='h5'>
               Employee
            </Typography> */}
            <Button variant='outlined' onClick={handleClickOpen}>
               Add Employee
            </Button>
            <Grid item xs={12} pt={1}>
               <DataGridTable
                  data={empData?.data}
                  loadinData={loadinData}
                  columns={columns}
                  map_by={(row) => row.employee_id}
                  pageState={pageState}
                  setPageState={setPageState}
               />
            </Grid>
         </Grid>

         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Employee</DialogTitle>
            <IconButton
               aria-label='close'
               onClick={handleClose}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
            <Formik
               initialValues={{
                  ...INITIAL_FORM_STATE,
               }}
               validationSchema={FORM_VALIDATION}
               onSubmit={handleRegister}
               // onSubmit={(values) => {
               //    console.log(values)
               // }}
            >
               {({ values, handleChange, handleBlur, touched ,isSubmitting  }) => (
                  <Form>
                     <DialogContent>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={12}>
                              <Text
                                 name='employee_name'
                                 label='Name'
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
                           <Grid item xs={6}>
                              <Text
                                 name='employee_email'
                                 label='Email'
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
                              <Text
                                 name='employee_number'
                                 label='Phone'
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
                              <Text
                                 name='employee_password'
                                 label='Password'
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
                     <CustomAutocomplete
                        name='employee_type'
                        label='Employment Type'
                        options={Empcategories}
                        value={values.employee_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.employee_type}
                     />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                     <CustomAutocomplete
                        name='employee_role'
                        label='Employee Role'
                        options={Role}
                        value={values.employee_role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.employee_role}
                     />
                  </Grid>
                           <Grid item xs={12} sm={6}>
                              <RadioButtonGroup
                                 label='Status'
                                 name='employee_status'
                                 options={[
                                    { value: true, label: 'Active' },
                                    { value: false, label: 'Inactive' },
                                 ]}
                              />
                           </Grid>
                           <Divider />

                           <Grid item xs={12} sm={5}>
                              <VisuallyHiddenInput
                                 id='logoInput'
                                 type='file'
                                 accept='image/*'
                              />
                           </Grid>
                        </Grid>
                        <DialogActions>
                           <Button
                              variant='contained'
                              color='primary'
                              type='submit'
                              size='large'
                              disabled={isSubmitting}
                           >
                             {isSubmitting ? "Submitting ..." : "Submit"}
                           </Button>
                        </DialogActions>
                     </DialogContent>
                  </Form>
               )}
            </Formik>
         </Dialog>
      </div>
   )
}

export default Dashboard
