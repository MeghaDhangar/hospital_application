// Autocomplete.js
import React from 'react'
import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { ErrorMessage } from 'formik'

const CustomAutocomplete = ({
   name,
   label,
   options,
   value,
   onChange,
   onBlur,
   touched,
}) => {
   return (
      <React.Fragment>
         <Autocomplete
            name={name}
            options={options}
            getOptionLabel={(option) => option}
            value={value}
            onChange={(event, newValue) => {
               onChange({ target: { name, value: newValue } })
            }}
            onBlur={onBlur}
            renderInput={(params) => (
               <TextField
                  {...params}
                  label={label}
                  InputProps={{
                     ...params.InputProps,
                     style: {
                        background: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '10px',
                     },
                  }}
               />
            )}
         />
         {touched && (
            <ErrorMessage
               name={name}
               component='div'
               style={{ color: '#d32f2f', fontSize: 9, fontWeight: '500' }}
            />
         )}
      </React.Fragment>
   )
}

export default CustomAutocomplete
