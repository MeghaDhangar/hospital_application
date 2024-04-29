import * as Yup from 'yup'

const DocUpdation = Yup.object().shape({
   doctor_profile_picture: Yup.string()
      .test('fileSize', 'File size is too large', (value) => {
         if (!value) {
            return true
         }
         return value && value.size <= 1024 * 1024
      })
      .required('profile picture is required'),

   disease_specialist: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   Stimes: Yup.string()
      .matches(
         /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
         'Invalid time format (hh:mm:ss)'
      )
      .required('Time is required'),

   Etimes: Yup.string()
      .matches(
         /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
         'Invalid time format (hh:mm:ss)'
      )
      .required('Time is required'),

   day: Yup.string()
      .min(1, 'At least one day must be selected')
      .required('Please select at least one day'),

   per_patient_time: Yup.string()
      .matches(
         /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
         'Invalid time format (hh:mm:ss)'
      )
      .required('Time is required'),

   status: Yup.string().required('Please select a status'),
})
export default DocUpdation
