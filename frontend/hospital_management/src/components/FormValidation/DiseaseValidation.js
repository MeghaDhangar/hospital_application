import * as Yup from 'yup'

const DISEASE_VALIDATION = Yup.object().shape({
   // disease_id: Yup.string()
   // .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
   // .required('Required!'),
   disease_name: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   disease_status: Yup.string().required('Please select a status'),
   // created_at: Yup.string()
   // .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
   // .required('Required!'),
   // updated_at: Yup.string()
   // .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
   // .required('Required!'),
})

export default DISEASE_VALIDATION
