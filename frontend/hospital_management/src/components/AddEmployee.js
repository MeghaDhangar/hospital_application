'use client'
import { Formik, Form } from 'formik'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
// import RadioButtonGroup from './form/RadioB/RadioButtonGroup';
import RadioButtonGroup from '@/components/RadioButton/RadioButtonGroup'
import CustomAutocomplete from '@/components/Autocomplete/index'
import Text from '@/components/Textfield/Text'
import Divider from '@mui/material/Divider'
import { useParams } from 'next/navigation'

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

const Empcategories = ['Part Time', 'Full Time']
const Role = ['Doctor', 'Manager']

const AddEmployee = ({ initialState, validationSchema, handleRegister , disableEmail = false , disablePass = false, closeButton = '' }) => {
   const router = useParams()
   console.log(router, 'param')

   return (
      <Formik
         initialValues={{
            ...initialState,
         }}
         validationSchema={validationSchema}
         onSubmit={handleRegister}
      >
         {({ values, handleChange, handleBlur, touched ,  isSubmitting }) => (
            <Form>
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
                         disabled={disableEmail}
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
                  {!disablePass && (
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
                        )}

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
            

                  <Grid item xs={12} sm={6}>
                     <VisuallyHiddenInput
                        id='logoInput'
                        type='file'
                        accept='image/*'
                     />
                  </Grid>

                  <Grid item xs={12} display='flex' justifyContent='end'>
                     {closeButton}
                     <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        size='large'
                        disabled={isSubmitting}

                     >
                     {isSubmitting ? 'Submitting...' : 'Submit'}
                     </Button>
                  </Grid>
               </Grid>
            </Form>
         )}
      </Formik>
   )
}

export default AddEmployee
