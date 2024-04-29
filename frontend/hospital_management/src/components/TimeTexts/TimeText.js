import React from 'react'
import { TextField } from '@mui/material'
import { useField } from 'formik'
import MaskedInput from 'react-text-mask'

const TimeMask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]

const TimeText = ({ name, ...otherProps }) => {
   const [field, meta] = useField(name)

   const configureTextfield = {
      ...field,
      ...otherProps,
      fullWidth: true,
      variant: 'outlined',
      InputProps: {
         inputComponent: TimeMaskCustom,
         style: {
            background: 'white',
            border: 'none',
            borderRadius: '20px',
         },
      },
   }

   if (meta && meta.touched && meta.error) {
      configureTextfield.error = true
      configureTextfield.helperText = meta.error
   }

   return <TextField {...configureTextfield} />
}

// eslint-disable-next-line react/display-name
const TimeMaskCustom = React.forwardRef((props, ref) => {
   return (
      <MaskedInput
         {...props}
         ref={ref}
         mask={TimeMask}
         placeholderChar={'\u2000'}
         showMask
      />
   )
})

export default TimeText
