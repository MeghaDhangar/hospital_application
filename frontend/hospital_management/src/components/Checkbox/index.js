import { Field, ErrorMessage } from 'formik'
import {
   FormControl,
   FormLabel,
   FormGroup,
   FormControlLabel,
   Checkbox,
} from '@mui/material'

const CheckboxGroup = ({ label, name, options }) => {
   return (
      <FormControl>
         <FormLabel>{label}</FormLabel>
         <Field name={name}>
            {({ field }) => (
               <FormGroup>
                  {options.map((option) => (
                     <FormControlLabel
                        key={option.value}
                        control={<Checkbox color='primary' />}
                        label={option.label}
                        labelPlacement='end'
                        {...field}
                        name={name}
                        value={option.value}
                     />
                  ))}
               </FormGroup>
            )}
         </Field>
         <ErrorMessage name={name} component='div' style={{ color: 'red' }} />
      </FormControl>
   )
}

export default CheckboxGroup

// {/* <CheckboxGroup
//   label="Select Options"
//   name="checkboxOptions"
//   options={[
//     { value: 'option1', label: 'Option 1' },
//     { value: 'option2', label: 'Option 2' },
//     { value: 'option3', label: 'Option 3' },
//   ]}
// /> */}
