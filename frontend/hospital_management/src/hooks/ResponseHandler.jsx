import { Logout } from '@mui/icons-material'
import { toast } from 'react-toastify'

export const showToastMessage = (status, response, pos, hide) => {
   switch (status) {
      case 'success':
         return toast.success(response, {
            position: pos || toast.POSITION.TOP_RIGHT,
            hideProgressBar: hide && true,
            closeButton: hide && false,
         })
      case 'error':
         return toast.error(response || 'Something went wrong !', {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: hide && true,
            closeButton: hide && false,
         })
      case 'warning':
         return toast.warning(response, {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: hide && true,
            closeButton: hide && false,
         })
      case 'info':
         return toast.info(response, {
            position: pos || toast.POSITION.TOP_RIGHT,
            hideProgressBar: hide && true,
            closeButton: hide && false,
         })
      default:
         return
   }
}

export async function ResponseHandler(props) {
   const { values, handleResponse } = props
   try {
      const response = await handleResponse(values).unwrap()
      if (response?.status === 200) {
         showToastMessage('success', response?.message)
      }
      return response
   } catch (err) {
      if (err?.status === 500 || err?.status === 400) {
         showToastMessage('error', err?.data?.message)
         return console.log(err?.data?.message, 'error')
      } else if (err?.status === 401) {
         showToastMessage('info', err?.data?.message)
         let text = 'Press a button!\nEither OK or Cancel.'
         if (window.confirm(text) === true) {
            return <Logout />
         }
      }
      return false
   }
}

// export default ResponseHandler

export async function MultiAPIResponseHandler(props) {
   const { values, handleResponse } = props
   try {
      const response = await handleResponse(values).unwrap()
      if (response?.data?.status === 'FINISHED') {
         showToastMessage('success', response?.message)
      }
      return response
   } catch (err) {
      if (err?.status === 500 || err?.status === 400) {
         showToastMessage('error', err?.data?.message)
         return console.log(err?.data?.message, 'error')
      } else if (err?.status === 401) {
         showToastMessage('info', err?.data?.message)
         let text = 'Press a button!\nEither OK or Cancel.'
         if (window.confirm(text) === true) {
            return <Logout />
         }
      }
      return false
   }
}

export const NoToastHandler = async (props) => {
   const { values, handleResponse } = props
   try {
      const response = await handleResponse(values).unwrap()
      return response
   } catch (err) {
      return false
   }
}
