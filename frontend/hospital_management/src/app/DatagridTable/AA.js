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

const GetActionButton = (props) => {
   const { row, onRowDelete, selectedRows, setSelectedRows } = props
   const [selectedRows, setSelectedRows] = useState([])

   const [openModal, setOpenModal] = useState(false)

   const handleDelete = (e) => {
      e.stopPropagation()
      setSelectedRows([row.employee_id]) // Assuming employee_id is the unique identifier
      setOpenModal(true)
      console.log('Delete:', row)
   }

   const handleEdit = () => {
      // Handle edit logic here
      console.log('Edit:', row)
   }

   const handleView = () => {
      // Handle view logic here
      console.log('View:', row)
   }

   const handleConfirmDelete = () => {
      // Perform delete logic here
      onRowDelete(row)
      setOpenModal(false)
   }

   const handleCloseModal = () => {
      setOpenModal(false)
   }

   return (
      <div
         style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
         <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogContent>
               <p>Do you want to delete the data for {row?.employee_name}?</p>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseModal} color='primary'>
                  No
               </Button>
               <Button onClick={handleConfirmDelete} color='primary'>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>

         <IconButton onClick={handleDelete} color='error' size='small'>
            <Delete />
         </IconButton>
         <IconButton onClick={handleEdit} color='primary' size='small'>
            <Create />
         </IconButton>
         <IconButton onClick={handleView} color='success' size='small'>
            <Visibility />
         </IconButton>
      </div>
   )
}
// make a galaxy with graphical designs in it

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
   // ... other columns
   {
      field: 'Actions',
      headerName: 'Actions',
      width: 120,
      headerClassName: 'headerlast',
      cellClassName: 'column-linelast',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
         <GetActionButton
            row={params.row}
            onRowDelete={'/* pass your delete function here */'}
         />
      ),
   },
]

// solve this above error acoording tou your given solution above
