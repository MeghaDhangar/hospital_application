'use client'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useAddEmployeeMutation, useRegisterAuth } from '@/services/Query'
import Employee_Validation from '../../../components/FormValidation/employeeValidation'
import { colors } from '@/styles/theme'
import AddEmployee from '@/components/AddEmployee'
import { toast } from 'react-toastify'

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

const INITIAL_FORM_STATE = {
   employee_name: '',
   employee_email: '',
   employee_number: '',
   employee_password: '', // not available
   employee_type: '',
   employee_role: '',
   employee_status: '',
   // created_by: 'admin',
   // updated_by: 'admin',
}

const EmpRegister = () => {
   // const searchParam = useSearchParams()

   // console.log( searchParam, "searchParam")

   // for(const [name, value] of searchParam.entries()) {
   //   console.log(name, value , "the name and value is")
   // }

   const [addemployee] = useAddEmployeeMutation()
   const [addAuthEmployee] = useRegisterAuth()


   
   return (
      <StyledFormWrapper>
         <StyledPaper elevation={3}>
            <StyledTypography variant='h4'>
               Employee Registration Form
            </StyledTypography>
            <Typography variant='h6'>General Information</Typography>

            <AddEmployee
               initialState={INITIAL_FORM_STATE}
               validationSchema={Employee_Validation}
               handleRegister={EmpRegister}
            />
         </StyledPaper>
      </StyledFormWrapper>
   )
}

export default EmpRegister
