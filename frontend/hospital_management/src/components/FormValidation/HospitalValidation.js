// formValidation.js
import * as Yup from 'yup'

const FORM_VALIDATION = Yup.object().shape({
   hospital_name: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   hospital_phone: Yup.string()
      .matches(/^(?!.*(\d)\1{5})[0-9]+$/, 'Invalid phone number')
      .test('is-ten-digits', 'Invalid phone number', (value) => {
         if (value) {
            return value.replace(/[^0-9]/g, '').length === 10
         }
         return false
      })
      .required('Required!'),
   hospital_email: Yup.string()
      .matches(
         /^(?=.*[a-zA-Z]).*^(?!.*@(email|yahoo)\.com).*[A-Za-z0-9]+@[A-Za-z0.9.-]+\.[A-Za-z]{2,4}$/,
         'Invalid email format'
      )
      .required('Required!')
      .test('email-provider', 'Email provider not allowed', (value) => {
         if (/(email|yahoo)\.com$/.test(value)) {
            return false
         }
         return true
      }),
   hospital_city: Yup.string().required('City is Required!'),
   hospital_address: Yup.string().required('Required!'),
   hospital_type: Yup.string().required('Please select an option'),
   hospital_category: Yup.string().required('Please select a category'),
   hospital_status: Yup.string().required('Please select a status'),
   logo: Yup.string()
      .test('fileSize', 'File size is too large', (value) => {
         if (!value) {
            return true
         }
         return value && value.size <= 1024 * 1024
      })
      .required('logo is required'),
   hospital_owner_name: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   hospital_owner_phone: Yup.string()
      .matches(/^(?!.*(\d)\1{5})[0-9]+$/, 'Invalid phone number')
      .test('is-ten-digits', 'Invalid phone number', (value) => {
         if (value) {
            return value.replace(/[^0-9]/g, '').length === 10
         }
         return false
      })
      .required('Required!'),
   hospital_owner_email: Yup.string()
      .matches(
         /^(?=.*[a-zA-Z]).*^(?!.*@(email|yahoo)\.com).*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
         'Invalid Email format'
      )
      .required('Required!')
      .test('email-provider', 'Email provider not allowed', (value) => {
         if (/(email|yahoo)\.com$/.test(value)) {
            return false
         }
         return true
      }),
   username: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one capital letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@#!*~$%^&+=_]/, 'Password must contain the special character')
      //   .matches(/_/, 'Password must contain an underscore')
      .required('Password is required'),
   // logo: Yup.string()
})

export default FORM_VALIDATION

// password should contains an special character this special character will be all that comes under it officially
