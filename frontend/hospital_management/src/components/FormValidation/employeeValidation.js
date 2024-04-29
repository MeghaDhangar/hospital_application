import * as Yup from 'yup';

const FORM_VALIDATION = Yup.object().shape({
   employee_name: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
      .required('Required'),

   employee_email: Yup.string()
      .email('Invalid email format')
      .notOneOf(['email.com', 'yahoo.com'], 'Email provider not allowed')
      .required('Required'),

   employee_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Invalid phone number')
      .required('Required'),

   employee_password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one capital letter')
      // ... (add other password validation rules)
      .required('Password is required'),

   employee_type: Yup.string().required('Please select a type'),
   employee_role: Yup.string().required('Please select a role'),
 


   employee_status: Yup.string().required('Please select a status'),

   // created_by: Yup.string()
   //    .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
   //    .required('Required'),

   // updated_by: Yup.string()
   //    .matches(/^[a-zA-Z\s]*$/, 'Invalid name')
   //    .required('Required'),
});

export default FORM_VALIDATION;
