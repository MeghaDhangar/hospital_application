'use client'
import { useState } from 'react'
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   IconButton,
} from '@mui/material'
import { Delete, Create, Visibility } from '@mui/icons-material'
import { useDeleteEmployeeMutation } from '@/services/Query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

//using the react modal component from mui, insert the proper functionality in delete button such that when the delete button will be clicked the modal component will be opened and the name of the person from the selected row will be shown and in modal and in subheading 'Do you want to delete the data' message will be shown with two buttons at the right bottm corner of the modal component, the buttons will be yes & no

const GetActionButton = (row) => {
   const router = useRouter()
   const [deleteEmployee] = useDeleteEmployeeMutation()

   const [selectedRow, setSelectedRow] = useState(null)
   const [openModal, setOpenModal] = useState(false)

   // console.log(row.params , "ok")
   const handleDelete = () => {
      setSelectedRow(row.params.row)
      setOpenModal(true)
   }
   // console.log('Delete :', selectedRow);

   const handleView = () => {
      // Handle view logic here
      console.log('View:', row)
   }

   const handleCloseModal = () => {
      setOpenModal(false)
   }

   const handleConfirmDelete = () => {
      const DltEmployee = async () => {
         try {
            await deleteEmployee(selectedRow.employee_id)
            toast.error('Employee Deleted Successfully')
         } catch (error) {
            // Handle error
            toast.error(JSON.stringify(error))
         }
      }

      // Perform delete logic here
      console.log('Deleting:', selectedRow)
      DltEmployee() // Call the delete function
      handleCloseModal()
   }

   return (
      <div
         style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
         <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle
               style={{
                  border: '1px solid white',
                  borderRadius: '10px',
                  boxShadow: 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px',
                  fontWeight: 'bolder',
                  fontSize: '1rem',
               }}
            >
               Delete Confirmation
            </DialogTitle>
            <DialogContent>
               <p>
                  Do you want to delete the data for{' '}
                  <span className='Data'>{selectedRow?.employee_name}</span>
               </p>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseModal} color='primary' className='No'>
                  No
               </Button>
               <Button onClick={handleConfirmDelete} color='primary' className='Yes'>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>

         <IconButton onClick={handleDelete} color='error' size='small'>
            <Delete />
         </IconButton>
         {/* dont fill the color in the delete button just outlineit */}
         <IconButton
            onClick={() => {
               router.push(
                  `/dashboard/addEmployee/${
                     row.params.row.employee_id
                  }?${JSON.stringify(row.params.row)}`
               )
               console.log('this works')
            }}
            color='primary'
            size='small'
         >
            <Create />
         </IconButton>
         <IconButton onClick={handleView} color='success' size='small'>
            <Visibility />
         </IconButton>
      </div>
   )
}

export const columns = [
   {
      field: 'employee_name',
      headerName: 'Name',
      width: 170,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'employee_email',
      headerName: 'Email',
      width: 280,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'employee_number',
      headerName: 'Phone',
      width: 210,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'employee_role',
      headerName: 'Role',
      width: 160,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'employee_status',
      headerName: 'Status',
      width: 180,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'employee_type',
      headerName: 'Type',
      width: 180,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
   },
   {
      field: 'Actions',
      headerName: 'Actions',
      width: 180,
      headerClassName: 'headerlast',
      cellClassName: 'column-linelast',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => <GetActionButton params={params} />,
   },
]

// how can I find out the particular row's data from this table when i click on the delete button
