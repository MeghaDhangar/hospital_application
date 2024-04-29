import * as Yup from 'yup'

const DOCTOR_VALIDATION = Yup.object().shape({
   doc_Id: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   disease_Specialist: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   doc_Type: Yup.string().required('Please select a status'),
   Created_At: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
   Updated_At: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required!'),
})

export default DOCTOR_VALIDATION
