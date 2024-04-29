'use client'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
// import { useAddEmployeeMutation } from '@/services/Query'
import Employee_Validation from '../../../../components/FormValidation/employeeValidation'
import { colors } from '@/styles/theme'
import AddEmployee from '../../../../components/AddEmployee'
import { useSearchParams } from 'next/navigation'

const StyledPaper = styled(Paper)(({ theme }) => ({
   maxWidth: '950px',
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

//for the whole form
const StyledFormWrapper = styled('div')({
   minHeight: '100vh',
   display: 'grid',
   placeItems: 'center',
   padding: '2rem',
   '@media (max-width: 450px)': {
      padding: '0rem',
   },
})

// const INITIAL_FORM_STATE = {
//    employee_name: '',
//    employee_email: '',
//    employee_number: '',
//    employee_password: '', // not available
//    employee_type: '',
//    employee_role: '',
//    employee_status: '',
//    created_by: 'admin',
//    updated_by: 'admin',
// }

const EmpRegister = () => {
   const searchParam = useSearchParams()

   let formatedInitialState = {}
   for (const [name] of searchParam.entries()) {
      formatedInitialState = name
      break
   }

   console.log('formatedInitialState', formatedInitialState)

   let originalFormate = {}
   let parsed = JSON.parse(formatedInitialState)
   for (const [name, value] of Object.entries(parsed)) {
      originalFormate[name] = value
   }

   console.log(originalFormate, 'originalFormate')

   // const [addemployee] = useAddEmployeeMutation()

   const handleRegister = async (values) => {
      console.log('values ', values)
   }

   return (
      <StyledFormWrapper>
         <StyledPaper elevation={3}>
            <StyledTypography variant='h4'>Edit Employee Form</StyledTypography>
            <Typography variant='h6'>General Information</Typography>

            <AddEmployee
               initialState={originalFormate}
               validationSchema={Employee_Validation}
               handleRegister={handleRegister}
            />
         </StyledPaper>
      </StyledFormWrapper>
   )
}

export default EmpRegister
