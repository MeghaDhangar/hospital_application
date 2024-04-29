'use client'
import { TextField } from '@mui/material'
import { useField } from 'formik'

const Text = ({ name, ...otherProps }) => {
   const [field, meta] = useField(name)

   const configureTextfield = {
      ...field,
      ...otherProps,
      fullWidth: true,
      variant: 'outlined',
   }

   if (meta && meta.touched && meta.error) {
      configureTextfield.error = true
      configureTextfield.helperText = meta.error
   }

   return <TextField {...configureTextfield} />
}

export default Text
